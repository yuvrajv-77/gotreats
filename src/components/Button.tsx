import React, { ButtonHTMLAttributes } from 'react'
import { cva } from 'class-variance-authority'
import { Spinner } from '@heroui/react';

const classes = cva(
  'inline-flex items-center justify-center gap-2 font-heading font-semibold tracking-tight transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]',
  {
    variants: {
      variant: {
        primary: "bg-[var(--brand-flame)] text-white hover:bg-[#C94808] focus:ring-[var(--brand-flame)] shadow-[0_0_20px_rgba(232,88,10,0.25)] hover:shadow-[0_0_30px_rgba(232,88,10,0.4)]",
        secondary: "bg-transparent text-[var(--brand-cream)] border border-[var(--brand-border)] hover:border-[var(--brand-flame)]/50 hover:bg-white/5 focus:ring-[var(--brand-border)]",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
        success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
      },
      size: {
        sm: "px-4 py-2 text-sm rounded-lg",
        md: "px-5 py-2.5 text-sm rounded-xl",
        lg: "px-7 py-3.5 text-base rounded-xl",
      },
    },
    defaultVariants: {
      size: 'md',
    }
  }
)

function Button(props: {
  variant: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { variant, className, size, isLoading, disabled, children, ...otherProps } = props;

  return (
    <button
      className={classes({ variant, className, size })}
      disabled={disabled || isLoading}
      {...otherProps}
    >
      {isLoading && <Spinner variant='simple' size='sm' color='white' />}
      <span className={isLoading ? "opacity-50 flex items-center gap-2" : "flex items-center gap-2"}>{children}</span>
    </button>
  )
}

export const IconButton = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: React.MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <button
      className={`${className} cursor-pointer p-2 hover:bg-white/8 flex justify-center gap-2 items-center rounded-xl focus:bg-white/8 transition-colors`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button