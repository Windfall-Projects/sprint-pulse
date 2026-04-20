'use client'

import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

export function Input({ 
  className = '', 
  icon, 
  trailingIcon,
  ...props 
}: InputProps) {
  return (
    <div 
      className={`bg-surface border border-border flex gap-2 items-center px-3 py-3 ${className}`}
      style={{ 
        borderRadius: 'var(--radius-pill)', 
        boxShadow: 'var(--shadow-sm)' 
      }}
    >
      {icon && (
        <span className="opacity-75 shrink-0 text-muted-foreground">
          {icon}
        </span>
      )}
      <input 
        className="bg-transparent border-none outline-none flex-1 text-foreground placeholder:text-foreground/50 text-base"
        {...props}
      />
      {trailingIcon && (
        <span className="opacity-75 shrink-0 text-muted-foreground">
          {trailingIcon}
        </span>
      )}
    </div>
  )
}
