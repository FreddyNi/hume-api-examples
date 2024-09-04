"use client";

import { Button } from "../button";  // Use the existing general button component

interface CustomButtonProps {
  onClick: () => void;  // Custom functionality when clicked
  label: string;        // The label for the button
  variant?: string;     // Optional: Pass button variant (default, destructive, etc.)
  size?: string;        // Optional: Pass button size (sm, lg, etc.)
}

export default function CustomButton({ onClick, label, variant = "default", size = "default" }: CustomButtonProps) {
  return (
    <Button
      onClick={onClick}  // Execute custom functionality
      variant={variant}  // Use button variants (e.g., default, destructive)
      size={size}        // Use button sizes (e.g., sm, lg)
    >
      {label}
    </Button>
  );
}
