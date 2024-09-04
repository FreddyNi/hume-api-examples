"use client";

import { useVoice } from "@humeai/voice-react";
import { Button } from "../button";  // Use the existing general button component

interface MessageButtonProps {
  message: string;  // The message to send when the button is clicked
  label: string;    // The label for the button
  variant?: string; // Optional: Pass button variant (default, destructive, etc.)
  size?: string;    // Optional: Pass button size (sm, lg, etc.)
}

export default function MessageButton({ message, label, variant = "default", size = "default" }: MessageButtonProps) {
  const { sendUserInput } = useVoice();

  return (
    <Button
      onClick={() => sendUserInput(message)}  // Send the message when clicked
      variant={variant}  // Use button variants (e.g., default, destructive)
      size={size}        // Use button sizes (e.g., sm, lg)
    >
      {label}
    </Button>
  );
}
