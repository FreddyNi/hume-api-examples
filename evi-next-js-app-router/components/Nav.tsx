"use client";

import { useLayoutEffect, useState } from "react";
// Removed unnecessary imports: HumeLogo, Button, Moon, Sun, Github, pkg

export const Nav = () => {
  // Removed isDarkMode state and related logic

  return (
    <div
      className={
        "px-4 py-2 flex items-center justify-center h-14 z-50 bg-card border-b border-border"
      }
    >
      {/* Centered "Rylorn" text */}
      <div className={"text-lg font-bold"}>
        Rylorn
      </div>
    </div>
  );
};
