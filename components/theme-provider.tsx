"use client"

import { useEffect, useState } from "react"
import { ThemeProvider as NextThemeProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: any) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}
