"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "neutral" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
}

export function Button({ 
  className = "", 
  variant = "primary", 
  size = "md", 
  children, 
  style,
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer";
  
  const variants: Record<string, { className: string; style?: React.CSSProperties }> = {
    primary: {
      className: "text-primary-contrast shadow-sm",
      style: { 
        backgroundImage: "var(--gradient-primary)",
        borderRadius: "var(--radius-pill)",
      },
    },
    secondary: {
      className: "bg-surface text-foreground hover:bg-surface-hover border border-border shadow-sm",
      style: { borderRadius: "var(--radius-pill)" },
    },
    neutral: {
      className: "bg-surface text-foreground hover:bg-surface-hover border border-border shadow-sm",
      style: { borderRadius: "var(--radius-pill)" },
    },
    outline: {
      className: "border-2 border-primary text-primary hover:bg-primary/10",
      style: { borderRadius: "var(--radius-pill)" },
    },
    ghost: {
      className: "text-foreground hover:bg-surface-hover",
      style: { borderRadius: "var(--radius-pill)" },
    },
  };
  
  const sizes = {
    xs: "px-3 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const v = variants[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${v.className} ${sizes[size]} ${className}`}
      style={{ ...v.style, ...style }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
