import type React from "react"
import type { Metadata } from "next"
import MarketingLayoutClient from "./MarketingLayoutClient"

export const metadata: Metadata = {
  title: "YASCG - Yet Another Strangers Card Game",
  description: "A fun card game to get to know your friends better through engaging questions and answers",
}

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <MarketingLayoutClient>{children}</MarketingLayoutClient>
}
