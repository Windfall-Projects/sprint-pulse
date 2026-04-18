"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends HTMLMotionProps<"div"> {
  glass?: boolean;
}

export function Card({ className = "", glass = true, children, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-xl p-6 shadow-lg ${glass ? 'glass' : 'bg-surface border border-border'} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
