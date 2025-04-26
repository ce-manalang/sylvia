"use client"

// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

// Import the navigation mocks
import { useRouter, useSearchParams, useParams } from "./__tests__/mocks/next-navigation"

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: () => useRouter(),
  useSearchParams: () => useSearchParams(),
  useParams: () => useParams(),
}))

// Mock the useMobile hook
jest.mock("@/hooks/use-mobile", () => ({
  useMobile: () => false,
}))

// Mock navigator.vibrate
Object.defineProperty(window.navigator, "vibrate", {
  value: jest.fn(),
  writable: true,
})

// Suppress React 18 console errors/warnings in test output
const originalConsoleError = console.error
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("ReactDOM.render is no longer supported")) {
    return
  }
  originalConsoleError(...args)
}

window.HTMLElement.prototype.scrollIntoView = jest.fn();
