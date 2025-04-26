import { render, screen, fireEvent } from "../utils/test-utils"
import UserList from "@/components/user-list"
import type { User } from "@/lib/types"

describe("UserList Component", () => {
  const users: User[] = [
    { id: "user1", name: "TestUser", isHost: true, score: 10 },
    { id: "user2", name: "Player2", isHost: false, score: 5 },
    { id: "user3", name: "Player3", isHost: false, score: 15 },
  ]

  const currentUser: User = users[0]
  const mockShowAnswers = jest.fn()
  const mockHasAnswers = jest.fn().mockImplementation((userId) => userId === "user2")

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders all users correctly", () => {
    render(
      <UserList users={users} currentUser={currentUser} onShowAnswers={mockShowAnswers} hasAnswers={mockHasAnswers} />,
    )

    // Check if all users are rendered
    expect(screen.getByText("TestUser")).toBeInTheDocument()
    expect(screen.getByText("Player2")).toBeInTheDocument()
    expect(screen.getByText("Player3")).toBeInTheDocument()

    // Check scores
    expect(screen.getByText("10 points")).toBeInTheDocument()
    expect(screen.getByText("5 points")).toBeInTheDocument()
    expect(screen.getByText("15 points")).toBeInTheDocument()
  })

  it("shows host indicator for host user", () => {
    render(
      <UserList users={users} currentUser={currentUser} onShowAnswers={mockShowAnswers} hasAnswers={mockHasAnswers} />,
    )

    // The host user should have a crown icon
    const hostUser = screen.getByText("TestUser").closest("div")?.parentElement
    expect(hostUser?.innerHTML).toContain("lucide-crown")
  })

  it('shows "You" badge for current user', () => {
    render(
      <UserList users={users} currentUser={currentUser} onShowAnswers={mockShowAnswers} hasAnswers={mockHasAnswers} />,
    )

    // The current user should have a "You" badge
    expect(screen.getByText("You")).toBeInTheDocument()
  })

  it.skip("shows message icon for users with answers", () => {
    const { container } = render(
      <UserList users={users} currentUser={currentUser} onShowAnswers={mockShowAnswers} hasAnswers={mockHasAnswers} />,
    )

    // Find the message button using the title attribute
    const messageButton = screen.getByTitle("View answers about this user")
    expect(messageButton).toBeInTheDocument()

    // Check that the message icon is inside the button
    expect(messageButton.innerHTML).toContain("lucide-message-square")

    // Verify it's associated with Player2
    const player2Element = screen.getByText("Player2")
    const player2Container = player2Element.closest("div")?.parentElement?.parentElement
    expect(player2Container).toContainElement(messageButton)
  })

  it("does not show message icon for users without answers", () => {
    render(
      <UserList users={users} currentUser={currentUser} onShowAnswers={mockShowAnswers} hasAnswers={mockHasAnswers} />,
    )

    // Player3 should not have a message button
    const player3Element = screen.getByText("Player3")
    const player3Container = player3Element.closest("div")?.parentElement?.parentElement

    // Count message buttons in the document
    const messageButtons = screen.getAllByTitle("View answers about this user")

    // There should be only one message button (for Player2)
    expect(messageButtons.length).toBe(1)

    // And it should not be inside Player3's container
    messageButtons.forEach((button) => {
      expect(player3Container).not.toContainElement(button)
    })
  })

  it("calls onShowAnswers when clicking message icon", () => {
    render(
      <UserList users={users} currentUser={currentUser} onShowAnswers={mockShowAnswers} hasAnswers={mockHasAnswers} />,
    )

    // Find and click the message icon for Player2
    const messageButton = screen.getByTitle("View answers about this user")
    fireEvent.click(messageButton)

    // Check if onShowAnswers was called with correct user ID
    expect(mockShowAnswers).toHaveBeenCalledWith("user2")
  })

  it("shows empty state when no users", () => {
    render(<UserList users={[]} currentUser={null} onShowAnswers={mockShowAnswers} hasAnswers={mockHasAnswers} />)

    expect(screen.getByText("No players have joined yet")).toBeInTheDocument()
  })
})
