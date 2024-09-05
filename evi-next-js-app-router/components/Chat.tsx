"use client";

import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef } from "react";
import { handleToolCall } from "@/utils/toolHandler"; // Import the tool handler function
import { checkForKeywords } from "@/utils/dialogueHandler"; // Import the dialogue handler

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  // Fetch the configId from the environment variables
  const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID || "fallback-config-id"; // Use the env value or a fallback

  const handleMessage = async (message: any) => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }

    // Log when a message is received for debugging purposes
    console.log("Message received from EVI:", message);

    // Extract the message content
    const messageContent = message.message?.content || "";

    // Check for specific keywords using the utility function
    await checkForKeywords(messageContent); // This will dispatch the event if a keyword is detected

    // Delegate tool call processing to a utility function
    if (message.type === "tool_call") {
      console.log("Tool call received, passing to handler."); // Debugging log
      handleToolCall(message); // Handle tool call in a separate utility function
    }

    timeout.current = window.setTimeout(() => {
      if (ref.current) {
        const scrollHeight = ref.current.scrollHeight;
        ref.current.scrollTo({
          top: scrollHeight,
          behavior: "smooth",
        });
      }
    }, 200); // Keep this delay as is for now
  };

  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
      <VoiceProvider
        auth={{ type: "accessToken", value: accessToken }}
        configId={configId} // Use the configId from .env
        onMessage={handleMessage} // Handle the message when received
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall />
      </VoiceProvider>
    </div>
  );
}
