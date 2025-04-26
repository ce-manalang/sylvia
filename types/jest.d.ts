import "jest"

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(className: string): R
      toHaveValue(value: string | number | string[]): R
    }
  }
}
