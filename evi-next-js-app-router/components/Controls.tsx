"use client";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";

export default function Controls() {
  const { disconnect, status, isMuted, unmute, mute, micFft, messages, sendUserInput } = useVoice();
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status.value === "connected") {
      resetTimer(); // Reset the timer on connection
    }
  }, [status]);

  useEffect(() => {
    if (messages.length > 0) {
      resetTimer(); // Reset the timer whenever a new message is received
    }
  }, [messages]);

  const startTimer = () => {
    stopTimer(); // Ensure no previous timers are running
    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => {
        const newTime = prevTime + 1;
        if (newTime >= 20) {
          sendUserInput("Repeat please");
          resetTimer(); // Reset the timer after sending the message
        }
        return newTime;
      });
    }, 1000); // Update the time every second
  };

  const resetTimer = () => {
    setElapsedTime(0); // Reset the displayed time
    startTimer(); // Start the timer again
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    // Clean up the timer when the component unmounts or disconnects
    return () => {
      stopTimer();
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full p-4 flex items-center justify-center",
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
              stopTimer(); // Stop the timer when the call ends
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

          {/* Display elapsed time */}
          <div className="ml-4">
            <span>Time since last response: {elapsedTime}s</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}