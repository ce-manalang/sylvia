"use client"

import type React from "react"

export default function MarketingLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen">
      {/* Override the fixed positioning from the root layout */}
      <style jsx global>{`
        body {
          position: static !important;
          height: auto !important;
          overflow: auto !important;
        }
      `}</style>
      {children}
    </div>
  )
}
