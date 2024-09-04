export const handleToolCall = (toolCallMessage: any) => {
    const { name, parameters } = toolCallMessage;
  
    // Log the tool call message for debugging
    console.log(`Tool call received: ${name}`, toolCallMessage);
  
    // Parse the tool call parameters
    let parsedParams;
    try {
      parsedParams = JSON.parse(parameters); // Ensure parameters are parsed correctly
    } catch (error) {
      console.error("Error parsing tool call parameters:", error);
      return;
    }
  
    switch (name) {
      case "UpdateRepeatInterval":
      case "time":  // Handle the 'time' tool (assuming it sets the interval)
        const newInterval = parsedParams.value;
        if (typeof newInterval === 'number') {
          console.log(`Handling ${name} tool: Setting repeatInterval to ${newInterval}`);
          // Dispatch a custom event to update the repeatInterval across components
          document.dispatchEvent(new CustomEvent("updateRepeatInterval", { detail: newInterval }));
        } else {
          console.error("Invalid value for repeatInterval:", newInterval);
        }
        break;
  
      // Add more tool handling cases here as needed
      default:
        console.log(`Unhandled tool call: ${name}`);
    }
  };
  