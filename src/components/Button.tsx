import React from 'react'

const Button = ({ children, className,onClick }: { children: React.ReactNode, className?: string, onClick?: React.MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <button className={` ${className} px-5 py-2 rounded-full text-white flex items-center gap-2 bg-orange-600 cursor-pointer hover:bg-orange-500`}
    onClick={onClick}>
      {children}
    </button>
  )
}

export const IconButton = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: React.MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <button className={` ${className} cursor-pointer p-2 hover:bg-gray-100 flex justify-center items-center rounded-full focus:bg-gray-100`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button