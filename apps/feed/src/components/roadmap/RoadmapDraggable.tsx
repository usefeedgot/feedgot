"use client"

import React from "react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"

export default function RoadmapDraggable({ id, children, className = "", isDragging = false }: { id: string; children: React.ReactNode; className?: string; isDragging?: boolean }) {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({ id })
  return (
    <motion.li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: transform ? CSS.Translate.toString(transform) : undefined }}
      className={
        "rounded-md border bg-background px-3 py-2 overflow-hidden cursor-grab active:cursor-grabbing select-none " +
        (isDragging ? "opacity-0 " : "") +
        (className ? className : "")
      }
      layout
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      whileHover={{ scale: isDragging ? 1 : 1.005 }}
    >
      {children}
    </motion.li>
  )
}
