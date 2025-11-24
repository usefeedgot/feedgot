import React from 'react'

interface DropdownIconProps {
  className?: string
  size?: number
}

export const DropdownIcon: React.FC<DropdownIconProps> = ({ className = '', size = 18 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      className={className}
    >
      <polyline
        points="15.25 6.5 9 12.75 2.75 6.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default DropdownIcon
