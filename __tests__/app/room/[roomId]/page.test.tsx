import { render, screen, fireEvent, act, waitFor } from "../../../utils/test-utils"
import RoomPage from "@/app/room/[roomId]/page"
import {
  setupRouterMock,
  setupParamsMock,
  setupSearchParamsMock,
  resetNavigationMocks,
} from "../../../mocks/next-navigation"

// Mock the questions
jest.mock("@/lib/questions", () => ({
  generateQuestions: () => [
    {
      id: "q1",
      text: "What do you think is [name] favorite food?",
      level: 1,
      category: "Preferences",
    },
  ],
}))

describe("RoomPage", () => {
  beforeEach(() => {
    // Setup default mocks
    setupRouterMock()
    setupParamsMock({ roomId: "TEST123" })
    setupSearchParamsMock({
      username: "TestUser",
      isHost: "true",
    })

    // Reset timer mocks
    jest.useFakeTimers()
  })

  afterEach(() => {
    resetNavigationMocks()
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  it("renders the room page with correct room ID and username", () => {
    render(<RoomPage />)

    expect(screen.getByText("Room: TEST123")).toBeInTheDocument()
    expect(screen.getByText(/You: TestUser/)).toBeInTheDocument()
  })

  it("shows welcome message on initial load", () => {
    render(<RoomPage />)

    expect(screen.getByText(/Welcome to Room TEST123/)).toBeInTheDocument()
    expect(screen.getByText(/Type \/card to draw a question card/)).toBeInTheDocument()
  })

  it("adds simulated users when user is host", async () => {
    render(<RoomPage />)

    // Fast-forward timers to trigger the setTimeout for adding users
    act(() => {
      jest.advanceTimersByTime(2000)
    })

    // Check if simulated users were added
    await waitFor(() => {
      expect(screen.getByText("Alex joined the room")).toBeInTheDocument()
      expect(screen.getByText("Jordan joined the room")).toBeInTheDocument()
    })
  })

  it("sends a regular chat message", () => {
    render(<RoomPage />)

    // Type a message
    const input = screen.getByPlaceholderText(/Type a message or \/card/)
    fireEvent.change(input, { target: { value: "Hello everyone!" } })

    // Send the message
    const form = input.closest("form")
    fireEvent.submit(form!)

    // Check if message appears in chat
    expect(screen.getByText("Hello everyone!")).toBeInTheDocument()

    // Input should be cleared
    expect(input).toHaveValue("")
  })

  it("handles /card command to draw a question card", async () => {
    render(<RoomPage />)

    // Fast-forward timers to add simulated users
    act(() => {
      jest.advanceTimersByTime(2000)
    })

    // Type /card command
    const input = screen.getByPlaceholderText(/Type a message or \/card/)
    fireEvent.change(input, { target: { value: "/card" } })

    // Send the command
    const form = input.closest("form")
    fireEvent.submit(form!)

    // Check if question card appears
    await waitFor(() => {
      expect(screen.getByText(/drew a question card about/)).toBeInTheDocument()
      // The question text should appear with the target user's name
      expect(screen.getByText(/favorite food/)).toBeInTheDocument()
    })

    // Input should be cleared
    expect(input).toHaveValue("")
  })

  it("shows error when using /card command with invalid username", () => {
    render(<RoomPage />)

    // Type /card command with invalid username
    const input = screen.getByPlaceholderText(/Type a message or \/card/)
    fireEvent.change(input, { target: { value: "/card InvalidUser" } })

    // Send the command
    const form = input.closest("form")
    fireEvent.submit(form!)

    // Check if error message appears
    expect(screen.getByText(/Couldn't find user "InvalidUser"/)).toBeInTheDocument()
  })

  it("shows error when trying to draw a card about yourself", async () => {
    render(<RoomPage />)

    // Type /card command with your own username
    const input = screen.getByPlaceholderText(/Type a message or \/card/)
    fireEvent.change(input, { target: { value: "/card TestUser" } })

    // Send the command
    const form = input.closest("form")
    fireEvent.submit(form!)

    // Check if error message appears
    expect(screen.getByText(/You can't draw a card about yourself/)).toBeInTheDocument()
  })

  it("navigates back to home page when leaving room", () => {
    const mockPush = jest.fn()
    setupRouterMock({ push: mockPush })

    render(<RoomPage />)

    // Click leave room button
    const leaveButton = screen.getByRole("button", { name: /leave room/i })
    fireEvent.click(leaveButton)

    // Check if router.push was called with correct path
    expect(mockPush).toHaveBeenCalledWith("/")
  })
})
