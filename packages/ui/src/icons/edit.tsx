import React from "react"

export function EditIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <g fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="m10 4h-5c-1.105 0-2 .895-2 2v13c0 1.105.895 2 2 2h13c1.105 0 2-.895 2-2v-5" strokeLinecap="square" strokeMiterlimit={10} />
        <line x1={16.25} y1={4.75} x2={19.25} y2={7.75} strokeMiterlimit={10} />
        <path d="m12 15-4 1 1-4L18 3c.828-.828 2.172-.828 3 0h0c.828.828.828 2.172 0 3l-9 9Z" strokeLinecap="square" strokeMiterlimit={10} />
      </g>
    </svg>
  )
}

export default EditIcon

