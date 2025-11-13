"use client"

import { cn } from "@feedgot/ui/lib/utils"
import { PointerDownIcon } from "@feedgot/ui/icons/pointer-down"
import { motion } from "framer-motion"

interface PointerProps {
  className?: string
  alt?: string
}

export function Pointer({ className, alt = "Switch features pointer" }: PointerProps) {
  return (
    <motion.div
      className={cn("flex justify-center", className)}
      initial={false}
      animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
    >
      <PointerDownIcon aria-label={alt} className="size-12 text-primary" opacity={1}/>
    </motion.div>
  )
}

export default Pointer