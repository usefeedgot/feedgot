import React from 'react'

export function MoreIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <title>more</title>
      <g fill="currentColor">
        <rect x="2" y="3" width="14" height="2" rx="1" />
        <rect x="2" y="6.5" width="12" height="2" rx="1" />
        <rect x="2" y="10" width="10" height="2" rx="1" />
      </g>
    </svg>
  )
}

export default MoreIcon
