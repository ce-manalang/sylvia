import { render, screen, fireEvent } from "../utils/test-utils"
import HomePage from "@/app/page"
import { setupRouterMock, resetNavigationMocks } from "../mocks/next-navigation"

describe("HomePage", () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    // Setup router mock with custom push function
    setupRouterMock({ push: mockPush })
  })

  afterEach(() => {
    resetNavigationMocks()
    jest.clearAllMocks()
  })

  it("renders the home page correctly", () => {
    render(<HomePage />)

    // Check for main elements
    expect(screen.getByText("Question Card Game")).toBeInTheDocument()
    expect(screen.getByText("Join a room or create your own to start playing!")).toBeInTheDocument()
    expect(screen.getByLabelText("Your Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Room Code")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Join Room" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Create New Room" })).toBeInTheDocument()
  })

  it("shows error when trying to join a room without username", async () => {
    const { container } = render(<HomePage />)

    // Try to join without username
    const joinButton = screen.getByRole("button", { name: "Join Room" })
    fireEvent.click(joinButton)

    // Debug the DOM to see what's actually rendered
    // console.log("DOM after click:", container.innerHTML)

    // Use a more direct approach to find the error message
    const errorElements = await screen.findAllByText(/please enter/i)
    // console.log("Found error elements:", errorElements.length)

    // Check if any of the found elements contain our expected text
    const usernameErrorElement = errorElements.find((el) => el.textContent?.toLowerCase().includes("username"))

    expect(usernameErrorElement).toBeDefined()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("shows error when trying to join a room without room code", async () => {
    render(<HomePage />)

    // Enter username but no room code
    const usernameInput = screen.getByLabelText("Your Name")
    fireEvent.change(usernameInput, { target: { value: "TestUser" } })

    // Try to join
    const joinButton = screen.getByRole("button", { name: "Join Room" })
    fireEvent.click(joinButton)

    // Use a more direct approach to find the error message
    const errorElements = await screen.findAllByText(/please enter/i)
    const roomCodeErrorElement = errorElements.find((el) => el.textContent?.toLowerCase().includes("room code"))

    expect(roomCodeErrorElement).toBeDefined()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("navigates to room page when joining with valid inputs", () => {
    render(<HomePage />)

    // Enter username and room code
    const usernameInput = screen.getByLabelText("Your Name")
    const roomCodeInput = screen.getByLabelText("Room Code")

    fireEvent.change(usernameInput, { target: { value: "TestUser" } })
    fireEvent.change(roomCodeInput, { target: { value: "ABC123" } })

    // Click join button
    const joinButton = screen.getByRole("button", { name: "Join Room" })
    fireEvent.click(joinButton)

    // Check if router.push was called with correct path
    expect(mockPush).toHaveBeenCalledWith("/room/ABC123?username=TestUser")
  })

  it("creates a new room when clicking create room button", () => {
    // Mock Math.random to return a predictable value for room code generation
    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0.123456789
    global.Math = mockMath

    render(<HomePage />)

    // Enter username
    const usernameInput = screen.getByLabelText("Your Name")
    fireEvent.change(usernameInput, { target: { value: "TestUser" } })

    // Click create room button
    const createButton = screen.getByRole("button", { name: "Create New Room" })
    fireEvent.click(createButton)

    // Check if router.push was called with correct path and generated room code
    expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/\/room\/[a-z0-9]{6}\?username=TestUser&isHost=true/i))
  })
})
