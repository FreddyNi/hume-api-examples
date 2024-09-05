export interface KeywordDelay {
    keyword: string;
    delay: number;
  }
  
  // Fetch the keyword-to-delay configuration from the config.json file
  async function loadKeywordDelays(): Promise<KeywordDelay[]> {
    try {
      const response = await fetch("/config/config.json");
      if (!response.ok) {
        throw new Error("Failed to load keyword delay configuration");
      }
  
      const config = await response.json();
      return config.keywordDelays || [];
    } catch (error) {
      console.error("Error loading keyword delays:", error);
      return [];
    }
  }
  
  // Check if the message content contains any of the configured keywords
  export async function checkForKeywords(messageContent: string): Promise<void> {
    const keywordDelays = await loadKeywordDelays();
  
    // Convert the message to lowercase for case-insensitive matching
    const lowerCaseMessage = messageContent.toLowerCase();
  
    // Check if any keyword is present in the message and trigger an event
    for (const { keyword, delay } of keywordDelays) {
      if (lowerCaseMessage.includes(keyword)) {
        console.log(`Keyword '${keyword}' detected, setting delay to ${delay} ms.`);
        
        // Dispatch a custom event to update the repeat interval
        const event = new CustomEvent("updateRepeatInterval", { detail: delay });
        document.dispatchEvent(event);
        return; // Stop after the first match
      }
    }
  }
  