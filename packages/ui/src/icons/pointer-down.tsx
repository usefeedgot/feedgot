import React from "react"

export function PointerDownIcon(props: React.SVGProps<SVGSVGElement>) {
  const { width = 18, height = 18, ...rest } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 18 18"
      opacity={0.4}
      {...rest}
    >
      <title>pointer-down</title>
      <circle cx="9" cy="9" r="7" fill="currentColor" fillOpacity="0.4" />
      <path d="M8.25 5V9.25H6.9L9 12L11.1 9.25H9.75V5H8.25Z" fill="currentColor" />
    </svg>
  )
}

export default PointerDownIcon