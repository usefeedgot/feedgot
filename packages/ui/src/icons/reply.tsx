import React from "react"

export function ReplyIcon(props: React.SVGProps<SVGSVGElement>) {
  const { width = 24, height = 24, ...rest } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      {...rest}
    >
      <path
        d="m20 3H4c-1.105 0-2 .895-2 2v11c0 1.105.895 2 2 2h5l3 4 3-4h5c1.105 0 2-.895 2-2V5c0-1.105-.895-2-2-2Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={2}
      />
    </svg>
  )
}

export default ReplyIcon

