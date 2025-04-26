import { render, screen } from "../utils/test-utils"
import ChatMessage from "@/components/chat-message"
import type { User, Message } from "@/lib/types"

// Define the extended message type that includes additional properties
interface ExtendedMessage extends Message {
  questionId?: string
  targetUserId?: string
  level?: number
  category?: string
}

describe("ChatMessage Component", () => {
  const currentUser: User = {
    id: "user1",
    name: "TestUser",
    isHost: true,
    score: 0,
  }

  const timestamp = new Date("2023-01-01T12:00:00Z")

  it("renders a system message correctly", () => {
    const systemMessage: ExtendedMessage = {
      id: "msg1",
      userId: "system",
      username: "System",
      text: "Welcome to the room!",
      timestamp,
      type: "system",
    }

    render(<ChatMessage message={systemMessage} isCurrentUser={false} currentUser={currentUser} />)

    expect(screen.getByText("Welcome to the room!")).toBeInTheDocument()
    // System messages have a specific styling
    expect(screen.getByText("Welcome to the room!").closest("div")).toHaveClass("bg-gray-100")
  })

  it("renders a question message correctly", () => {
    const questionMessage: ExtendedMessage = {
      id: "msg2",
      userId: "question",
      username: "Question",
      text: "What is TestUser's favorite food?",
      timestamp,
      type: "question",
      questionId: "q1",
      targetUserId: "user2",
      level: 1,
      category: "Preferences",
    }

    render(<ChatMessage message={questionMessage} isCurrentUser={false} currentUser={currentUser} />)

    expect(screen.getByText('"What is TestUser\'s favorite food?"')).toBeInTheDocument()
    expect(screen.getByText("Preferences")).toBeInTheDocument()
    expect(screen.getByText("Level 1")).toBeInTheDocument()
  })

  it("renders a user message from current user correctly", () => {
    const userMessage: ExtendedMessage = {
      id: "msg3",
      userId: "user1",
      username: "TestUser",
      text: "Hello everyone!",
      timestamp,
      type: "user",
    }

    render(<ChatMessage message={userMessage} isCurrentUser={true} currentUser={currentUser} />)

    expect(screen.getByText("Hello everyone!")).toBeInTheDocument()
    // Current user messages should be aligned to the right
    const messageContainer = screen.getByText("Hello everyone!").closest("div")?.parentElement?.parentElement
    expect(messageContainer).toHaveClass("flex max-w-[85%] flex-row-reverse")
  })

  it("renders a user message from another user correctly", () => {
    const userMessage: ExtendedMessage = {
      id: "msg4",
      userId: "user2",
      username: "OtherUser",
      text: "Hi there!",
      timestamp,
      type: "user",
    }

    render(<ChatMessage message={userMessage} isCurrentUser={false} currentUser={currentUser} />)

    expect(screen.getByText("Hi there!")).toBeInTheDocument()
    expect(screen.getByText(/OtherUser •/)).toBeInTheDocument()
    // Other user messages should be aligned to the left
    const messageContainer = screen.getByText("Hi there!").closest("div")?.parentElement?.parentElement
    expect(messageContainer).toHaveClass("flex max-w-[85%] flex-row")
  })

  it("renders an answer message correctly", () => {
    const answerMessage: ExtendedMessage = {
      id: "msg5",
      userId: "user1",
      username: "TestUser",
      text: "Pizza",
      timestamp,
      type: "answer",
      questionId: "q1",
      targetUserId: "user2",
    }

    render(<ChatMessage message={answerMessage} isCurrentUser={true} currentUser={currentUser} />)

    expect(screen.getByText("Pizza")).toBeInTheDocument()
    expect(screen.getByText("Your answer:")).toBeInTheDocument()
  })
})
