"use client"

import * as React from "react"

export default function DomainThemeEffect({ theme }: { theme: "light" | "dark" | "system" }) {
  React.useEffect(() => {
    const root = document.documentElement
    const mq = window.matchMedia("(prefers-color-scheme: dark)")

    const apply = (mode: "light" | "dark") => {
      if (mode === "dark") {
        root.classList.add("dark")
        root.style.colorScheme = "dark"
      } else {
        root.classList.remove("dark")
        root.style.colorScheme = "light"
      }
    }

    if (theme === "system") {
      apply(mq.matches ? "dark" : "light")
      const onChange = (e: MediaQueryListEvent) => apply(e.matches ? "dark" : "light")
      mq.addEventListener("change", onChange)
      return () => mq.removeEventListener("change", onChange)
    }

    apply(theme)
    try {
      localStorage.setItem("feedgot:domain-theme", theme)
    } catch {}
  }, [theme])

  return null
}
