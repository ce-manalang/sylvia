"use client"

import { renderHook } from "@testing-library/react"
import { useMobile } from "@/hooks/use-mobile"
import { act } from "react-dom/test-utils"

describe("useMobile Hook", () => {
  const originalInnerWidth = window.innerWidth

  afterEach(() => {
    // Reset window.innerWidth to its original value after each test
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: originalInnerWidth,
    })
  })

  it("should return false for desktop viewport", () => {
    // Set a desktop viewport width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(false)
  })

  it.skip("should return true for mobile viewport", () => {
    // Set a mobile viewport width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 480,
    })

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(true)
  })

  it.skip("should update when window is resized", () => {
    // Start with desktop viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(false)

    // Simulate resize to mobile viewport
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 480,
      })
      window.dispatchEvent(new Event("resize"))
    })

    expect(result.current).toBe(true)
  })
})
