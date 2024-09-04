"use client";

import { useState, useEffect } from "react";
import MessageButton from "./MessageButton";
import CustomButton from "./CustomButton";

export default function ButtonsContainer() {
  const [button1, setButton1] = useState({ label: "Button 1", message: "Message 1" });
  const [button2, setButton2] = useState({ label: "Button 2", message: "Message 2" });

  const handleCustomAction = () => {
    console.log("Custom action triggered");
  };

  useEffect(() => {
    // Fetch config.json and set the button labels and messages
    const loadConfig = async () => {
      try {
        const response = await fetch("/config/config.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const config = await response.json();

        if (config.button1 && config.button2) {
          setButton1(config.button1);  // Set button1 label and message from config
          setButton2(config.button2);  // Set button2 label and message from config
        }
      } catch (error) {
        console.error("Error loading configuration:", error);
      }
    };

    loadConfig();
  }, []);

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {/* Button 1 (e.g., "Ready") */}
      <MessageButton message={button1.message} label={button1.label} variant="default" size="default" />

      {/* Button 2 (e.g., "Not yet") */}
      <MessageButton message={button2.message} label={button2.label} variant="default" size="default" />

      {/* Button to send a "Help" message */}
      <MessageButton message="Help" label="Help" variant="outline" size="sm" />

      {/* Button for custom action with reduced size */}
      <CustomButton onClick={handleCustomAction} label="Custom Action" variant="destructive" size="sm" />
    </div>
  );
}
