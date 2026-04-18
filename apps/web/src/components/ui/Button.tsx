"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({ 
  className = "", 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-md",
    secondary: "bg-surface text-foreground hover:bg-surface-hover shadow-sm border border-border",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "text-foreground hover:bg-surface-hover",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
