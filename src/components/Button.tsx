import React, { ButtonHTMLAttributes } from 'react'
import { cva } from 'class-variance-authority'
import { Spinner } from '@heroui/react';

const classes = cva(
  'px-5 py-2 rounded-full flex items-center justify-center gap-2 transition-colors  ',
  {
    variants: {
      variant: {
        primary: "bg-orange-600 text-white hover:bg-orange-500",
        secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-500",
        success: "bg-green-600 text-white hover:bg-green-500"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      },
      disabled: {
        true: "bg-gray-300 text-gray-500 cursor-not-allowed",
        false: "cursor-pointer"
      }
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
      className={classes({ variant, className, size, disabled: disabled || isLoading })}
      disabled={disabled || isLoading}
      {...otherProps}
    >
      {isLoading && <Spinner variant='simple' size='sm' color='white' />}
      <span className={isLoading ? "opacity-50 flex items-center gap-2" : " flex items-center gap-2"}>{children}</span>
    </button>
  )
}

export const IconButton = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: React.MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <button className={` ${className} cursor-pointer p-2 hover:bg-gray-100 flex justify-center gap-2 items-center rounded-full focus:bg-gray-100`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button