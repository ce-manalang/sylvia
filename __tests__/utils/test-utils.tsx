import type React from "react"
import type { ReactElement } from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { ThemeProvider } from "@/components/theme-provider"
import userEvent from "@testing-library/user-event"

// Create a custom render function that includes providers
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    )
  }

  return {
    ...render(ui, { wrapper: AllProviders, ...options }),
    user: userEvent.setup(),
  }
}

// Re-export everything from testing-library
export * from "@testing-library/react"

// Override the render method
export { customRender as render }
