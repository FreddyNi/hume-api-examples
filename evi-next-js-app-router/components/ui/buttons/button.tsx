// components/ui/buttons/Button.tsx
import * as React from "react";
import { cn } from "@/utils"; // Assuming you have a utility function like 'cn' for class names

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  size?: "sm" | "default" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
      {
        default: "bg-primary text-white hover:bg-primary-dark",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
        ghost: "text-gray-700 hover:bg-gray-100",
        link: "text-blue-500 underline hover:text-blue-600",
      }[variant],
      {
        sm: "h-8 px-2",
        default: "h-10 px-4",
        lg: "h-12 px-6",
      }[size],
      className
    );

    return (
      <button className={baseClasses} ref={ref} {...props}>
        {props.children}
      </button>
    );
  }
);

Button.displayName = "Button";
