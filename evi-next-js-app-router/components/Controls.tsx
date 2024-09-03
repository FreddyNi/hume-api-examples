"use client";
import { useVoice } from "@humeai/voice-react";
import { Button } from "./ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import { cn } from "@/utils";

export default function Controls() {
  const { disconnect, status, isMuted, unmute, mute, micFft } = useVoice();

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
            {/* Adjust height to ensure visibility */}
            <MicFFT fft={micFft} className={"fill-current w-full h-full"} />
          </div>

          <Button
            className={"flex items-center gap-1 flex-shrink-0"}
            onClick={() => {
              disconnect();
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
    </div>
  );
}
