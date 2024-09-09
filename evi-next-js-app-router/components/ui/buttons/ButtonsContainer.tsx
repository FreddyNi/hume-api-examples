import { useState, useEffect } from "react";
import MessageButton from "./MessageButton";
import CustomButton from "./CustomButton";
import { useVoice } from "@humeai/voice-react"; // Import useVoice to access TTS

export default function ButtonsContainer() {
  const { sendAssistantInput } = useVoice(); // Get the TTS method from useVoice

  const [button1, setButton1] = useState({ label: "Button 1", message: "Message 1" });
  const [button2, setButton2] = useState({ label: "Button 2", message: "Message 2" });
  const [helpMessage, setHelpMessage] = useState(""); // Add state for help message

  useEffect(() => {
    // Fetch config.json and set the button labels, messages, and help message
    const loadConfig = async () => {
      try {
        const response = await fetch("/config/config.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const config = await response.json();

        if (config.button1 && config.button2) {
          setButton1(config.button1);
          setButton2(config.button2);
        }

        if (config.helpMessage) {
          setHelpMessage(config.helpMessage); // Set helpMessage from config
        }
      } catch (error) {
        console.error("Error loading configuration:", error);
      }
    };

    loadConfig();
  }, []);

  // Function to handle help button click
  const handleHelpClick = () => {
    sendAssistantInput(helpMessage); // Use the help message from config
    console.log("Help button clicked:", helpMessage); // Optional log for debugging
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {/* Button 1 */}
      <MessageButton message={button1.message} label={button1.label} variant="default" size="default" />

      {/* Button 2 */}
      <MessageButton message={button2.message} label={button2.label} variant="default" size="default" />

      {/* Help Button */}
      <CustomButton onClick={handleHelpClick} label="Help" variant="outline" size="sm" />

      {/* Custom Button */}
      <CustomButton onClick={() => console.log("Custom action triggered")} label="Custom Action" variant="destructive" size="sm" />
    </div>
  );
}
