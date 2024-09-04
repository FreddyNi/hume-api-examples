"use client";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import ButtonsContainer from "./ui/buttons/ButtonsContainer";  // Import the ButtonsContainer

export default function Controls() {
  const { disconnect, status, isMuted, unmute, mute, micFft, messages, sendUserInput } = useVoice();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null);  // Reference to store the call timeout

  // Initialize state values with default values
  const [repeatInterval, setRepeatInterval] = useState(5000);
  const [repeatMessage, setRepeatMessage] = useState("Repeat please");
  const [callEndThreshold, setCallEndThreshold] = useState(30000);  // Default threshold for ending the call

  // Listen for tool call events like updating repeatInterval
  useEffect(() => {
    const updateIntervalHandler = (event: CustomEvent) => {
      const newInterval = event.detail;
      console.log(`Updating repeatInterval to: ${newInterval}`);
      
      if (typeof newInterval === 'number') {
        setRepeatInterval(newInterval); // Safely set the repeatInterval state
      } else {
        console.error("Invalid value for repeatInterval:", newInterval);
      }
    };

    document.addEventListener("updateRepeatInterval", updateIntervalHandler);

    return () => {
      document.removeEventListener("updateRepeatInterval", updateIntervalHandler);
    };
  }, []);

  // Load config.json and extract repeatInterval, repeatMessage, and callEndThreshold
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch("/config/config.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const config = await response.json();

        // Set the repeatInterval, repeatMessage, and callEndThreshold from config.json
        if (config.repeatInterval) {
          setRepeatInterval(config.repeatInterval);
        }
        if (config.repeatMessage) {
          setRepeatMessage(config.repeatMessage);
        }
        if (config.callEndThreshold) {
          setCallEndThreshold(config.callEndThreshold);
        }
      } catch (error) {
        console.error("Error loading configuration:", error);
      }
    };

    loadConfig();
  }, []);

  const startTimer = () => {
    stopTimer();  // Ensure any previous timer is stopped
    timerRef.current = setTimeout(() => {
      sendUserInput(repeatMessage);  // Use the message from config
      resetTimer();  // Restart the timer after sending the message
    }, repeatInterval);  // Use the interval from config or the tool call
  };

  const resetTimer = () => {
    startTimer();  // Start the timer again
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;  // Clear the reference to avoid re-triggering
    }
  };

  const startCallTimeout = () => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
    }
    callTimeoutRef.current = setTimeout(() => {
      disconnect();  // Automatically end the call after the threshold
    }, callEndThreshold);  // Use the threshold from config
  };

  useEffect(() => {
    if (status.value === "connected") {
      startTimer();  // Start the repeat message timer
      startCallTimeout();  // Start the call timeout
    } else {
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);  // Clear the call timeout if the call is disconnected
      }
    }

    return () => {
      stopTimer();  // Clean up the repeat message timer when the component unmounts or disconnects
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);  // Clean up the call timeout
      }
    };
  }, [status]);

  useEffect(() => {
    if (messages.length > 0) {
      resetTimer();  // Reset the repeat message timer whenever a new message is received
    }
  }, [messages]);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full p-4 flex flex-col items-center justify-center",  // Changed to "flex-col" to stack items vertically
        "bg-gradient-to-t from-card via-card/90 to-card/0",
      )}
    >
      {status.value === "connected" && (
        <motion.div
          initial={{
            y: "100%",
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{
            y: "100%",
            opacity: 0,
          }}
          className={
            "p-4 bg-card border border-border rounded-lg shadow-sm flex items-center gap-4 w-full max-w-lg mx-auto"
          }
        >
          <Toggle
            pressed={!isMuted}
            onPressedChange={() => {
              if (isMuted) {
                unmute();
              } else {
                mute();
              }
            }}
            className="flex-shrink-0"
          >
            {isMuted ? (
              <MicOff className={"size-6 sm:size-4"} />
            ) : (
              <Mic className={"size-6 sm:size-4"} />
            )}
          </Toggle>

          <div className="flex-grow relative h-12">
            <MicFFT fft={micFft} className={"fill-current w-full h-full"} />
          </div>

          <Button
            className={"flex items-center gap-1 flex-shrink-0"}
            onClick={() => {
              disconnect();
              stopTimer();  // Stop the repeat message timer when the call ends
              if (callTimeoutRef.current) {
                clearTimeout(callTimeoutRef.current);  // Stop the call timeout when the call ends manually
              }
            }}
            variant={"destructive"}
            style={{ padding: "0 8px", borderRadius: "8px" }}
          >
            <span>
              <Phone
                className={"size-6 sm:size-4 opacity-50"}
                strokeWidth={2}
                stroke={"currentColor"}
              />
            </span>
            <span>End Call</span>
          </Button>
        </motion.div>
      )}

      {/* Render the ButtonsContainer below the existing controls */}
      <ButtonsContainer />  {/* This will now appear below the mic and call controls */}
    </div>
  );
}
