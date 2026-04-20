"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends HTMLMotionProps<"div"> {
  glass?: boolean;
}

export function Card({ className = "", glass = false, children, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`p-6 ${glass ? 'glass' : 'bg-surface border border-border'} ${className}`}
      style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
