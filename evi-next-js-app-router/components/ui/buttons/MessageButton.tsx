"use client";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./Button"; // Ensure this path is correct

interface MessageButtonProps {
  message: string;
  label: string;
  variant: string;
  size: string;
}

export default function MessageButton({ message, label, variant, size }: MessageButtonProps) {
  const { sendUserInput } = useVoice();

  const handleClick = () => {
    // Print the message to the console (or you can display it on the UI)
    console.log(`${label} button clicked: ${message}`);

    // Send the message to EVI for text-to-speech (TTS)
    sendUserInput(message);
  };

  return (
    <Button onClick={handleClick} variant={variant} size={size}>
      {label}
    </Button>
  );
}
