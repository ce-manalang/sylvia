"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Users, Send, ArrowLeft } from "lucide-react"
import UserList from "@/components/user-list"
import ChatMessage from "@/components/chat-message"
import { generateQuestions } from "@/lib/questions"
import type { User, Question, Message, Answer } from "@/lib/types"
import { useMobile } from "@/hooks/use-mobile"
import { useMounted } from "@/hooks/use-mounted"

// Add at the top of the file, after the imports
type ExtendedMessage = Message & {
  questionId?: string
  targetUserId?: string
  level?: number
  category?: string
}

// Helper function to generate stable IDs
const generateStableId = (prefix: string, seed: string) => {
  return `${prefix}-${seed}`
}

export default function RoomPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const username = searchParams.get("username") || "Anonymous"
  const isHost = searchParams.get("isHost") === "true"
  const isMobile = useMobile()
  const mounted = useMounted()

  const [users, setUsers] = useState<User[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [messages, setMessages] = useState<ExtendedMessage[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [targetUser, setTargetUser] = useState<User | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [showingAnswers, setShowingAnswers] = useState(false)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize the room
  useEffect(() => {
    if (!mounted || isInitialized) return

    // Add current user with a stable ID
    const currentUser: User = {
      id: `user-${username}-${roomId}`,
      name: username,
      isHost,
      score: 0,
    }

    setUsers([currentUser])
    setCurrentUser(currentUser)

    // Generate questions
    const generatedQuestions = generateQuestions()
    setQuestions(generatedQuestions)

    // Add welcome message with a stable ID
    setMessages([
      {
        id: `welcome-${roomId}`,
        userId: "system",
        username: "System",
        text: `Welcome to Room ${roomId}! Type /card to draw a question card about someone in the room.`,
        timestamp: new Date(),
        type: "system",
      },
    ])

    // Simulate other users joining (for demo purposes)
    // if (isHost) {
    //   setTimeout(() => {
    //     const newUsers = [
    //       { id: "user-alex", name: "Alex", isHost: false, score: 0 },
    //       { id: "user-jordan", name: "Jordan", isHost: false, score: 0 },
    //     ]

    //     setUsers((prev) => [...prev, ...newUsers])

    //     // Add join messages with stable IDs
    //     setMessages((prev) => [
    //       ...prev,
    //       {
    //         id: `join-alex-${roomId}`,
    //         userId: "system",
    //         username: "System",
    //         text: `${newUsers[0].name} joined the room`,
    //         timestamp: new Date(),
    //         type: "system",
    //       },
    //       {
    //         id: `join-jordan-${roomId}`,
    //         userId: "system",
    //         username: "System",
    //         text: `${newUsers[1].name} joined the room`,
    //         timestamp: new Date(),
    //         type: "system",
    //       },
    //     ])
    //   }, 1500)
    // }

    setIsInitialized(true)
  }, [mounted, isInitialized, username, isHost, roomId])

  // Handle keyboard detection only after mounting
  useEffect(() => {
    if (!mounted) return

    const handleResize = () => {
      if (isMobile) {
        const isKeyboard = window.innerHeight < window.outerHeight * 0.75
        setIsKeyboardOpen(isKeyboard)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [mounted, isMobile])

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (mounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, mounted])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!messageInput.trim()) return

    // Check for commands
    if (messageInput.startsWith("/card")) {
      handleCardCommand()
    } else {
      // Regular message
      const newMessage: Message = {
        id: generateStableId("msg", `${currentUser?.id}-${Date.now()}`),
        userId: currentUser?.id || "",
        username: currentUser?.name || "",
        text: messageInput,
        timestamp: new Date(),
        type: "user",
      }

      setMessages((prev) => [...prev, newMessage])
    }

    setMessageInput("")

    // On mobile, focus back on input after sending
    if (isMobile && mounted) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }

  const handleCardCommand = () => {
    if (!mounted || !currentUser) return

    // Parse command for target user
    const commandParts = messageInput.split(" ")
    let targetUsername = ""

    if (commandParts.length > 1) {
      targetUsername = commandParts.slice(1).join(" ")
    }

    // Find target user
    let selectedUser: User | null = null

    if (targetUsername) {
      selectedUser = users.find((u) => u.name.toLowerCase() === targetUsername.toLowerCase()) || null
    } else {
      // Deterministically select a user that isn't the current user
      const otherUsers = users.filter((u) => u.id !== currentUser?.id)
      if (otherUsers.length > 0) {
        // Use a stable selection method
        const index = (currentUser.name.length + roomId.length) % otherUsers.length
        selectedUser = otherUsers[index]
      }
    }

    if (!selectedUser) {
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: generateStableId("error", `${targetUsername}-${Date.now()}`),
          userId: "system",
          username: "System",
          text: `Couldn't find user "${targetUsername}". Try again with a valid username.`,
          timestamp: new Date(),
          type: "system",
        },
      ])
      return
    }

    // Don't allow selecting yourself
    if (selectedUser.id === currentUser?.id) {
      setMessages((prev) => [
        ...prev,
        {
          id: generateStableId("error", `self-${Date.now()}`),
          userId: "system",
          username: "System",
          text: `You can't draw a card about yourself. Choose another player.`,
          timestamp: new Date(),
          type: "system",
        },
      ])
      return
    }

    // Select a question deterministically
    const questionIndex = (currentUser.name.length + selectedUser.name.length + roomId.length) % questions.length
    const selectedQuestion = questions[questionIndex]

    // Format the question text
    const formattedQuestion = selectedQuestion.text.replace("[name]", selectedUser.name + "'s")

    // Add question card message
    setMessages((prev) => [
      ...prev,
      {
        id: generateStableId("card", `${selectedUser.id}-${Date.now()}`),
        userId: "system",
        username: "System",
        text: `${currentUser?.name} drew a question card about ${selectedUser.name}!`,
        timestamp: new Date(),
        type: "system",
      },
      {
        id: generateStableId("question", `${selectedQuestion.id}-${Date.now()}`),
        userId: "question",
        username: "Question",
        text: formattedQuestion,
        timestamp: new Date(),
        type: "question",
        questionId: selectedQuestion.id,
        targetUserId: selectedUser.id,
        level: selectedQuestion.level,
        category: selectedQuestion.category || "General",
      },
    ])

    // Vibrate on mobile devices when a card is drawn
    if (mounted && isMobile && navigator.vibrate) {
      navigator.vibrate(200)
    }
  }

  const handleAnswerInChat = (questionId: string, targetUserId: string) => {
    if (!messageInput.trim() || !currentUser || !mounted) return

    // Create new answer
    const newAnswer: Answer = {
      id: generateStableId("answer", `${questionId}-${currentUser.id}-${Date.now()}`),
      questionId: questionId,
      targetUserId: targetUserId,
      userId: currentUser.id,
      username: currentUser.name,
      text: messageInput,
      timestamp: new Date(),
    }

    // Add answer
    setAnswers((prev) => [...prev, newAnswer])

    // Add answer message
    setMessages((prev) => [
      ...prev,
      {
        id: generateStableId("answer-msg", `${newAnswer.id}`),
        userId: currentUser.id,
        username: currentUser.name,
        text: messageInput,
        timestamp: new Date(),
        type: "answer",
        questionId: questionId,
        targetUserId: targetUserId,
      },
    ])

    // Clear input
    setMessageInput("")
  }

  const handleShowAnswers = (targetUserId: string) => {
    if (!mounted) return
    setTargetUser(users.find((u) => u.id === targetUserId) || null)
    setShowingAnswers(true)
  }

  const handleCloseAnswers = () => {
    if (!mounted) return
    setShowingAnswers(false)
    setTargetUser(null)
  }

  const leaveRoom = () => {
    router.push("/")
  }

  // Filter answers for the current target user
  const filteredAnswers = answers.filter((a) => a.targetUserId === targetUser?.id)

  // Don't render anything during server-side rendering or hydration
  if (!mounted) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <main className="flex flex-col h-[100dvh] bg-gradient-to-b from-purple-50 to-blue-50 overflow-hidden">
      {/* Mobile header */}
      <div className="flex justify-between items-center p-3 border-b bg-white shadow-sm">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={leaveRoom} aria-label="Leave Room" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-bold text-purple-800">Room: {roomId}</h1>
            <p className="text-xs text-gray-600">
              You: {username} {isHost && "(Host)"}
            </p>
          </div>
        </div>

        {/* Mobile sidebar toggle */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Users className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                {users.length}
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Players ({users.length})</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <UserList
                users={users}
                currentUser={currentUser}
                onShowAnswers={handleShowAnswers}
                hasAnswers={(userId) => answers.some((a) => a.targetUserId === userId)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Chat area - takes remaining height */}
      <div className="flex-grow overflow-hidden flex flex-col">
        {/* Messages area - takes all available space */}
        <div className="flex-grow overflow-y-auto p-3 custom-scrollbar">
          <div className="space-y-3">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={message.userId === currentUser?.id}
                onAnswer={
                  message.type === "question" && message.targetUserId !== currentUser?.id
                    ? () => handleAnswerInChat(message.questionId!, message.targetUserId!)
                    : undefined
                }
                currentUser={currentUser}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area - fixed at bottom */}
        <div className="p-2 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              ref={inputRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message or /card..."
              className="flex-grow text-base"
            />
            <Button type="submit" size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-xs text-gray-500 mt-1">Tip: Type /card [username] for a specific person</div>
        </div>
      </div>

      {/* Answers modal */}
      {showingAnswers && targetUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-medium">Answers about {targetUser.name}</h3>
              <Button variant="ghost" size="icon" onClick={handleCloseAnswers}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              {filteredAnswers.length > 0 ? (
                filteredAnswers.map((answer) => (
                  <div key={answer.id} className="border rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{answer.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{answer.username}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{answer.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No answers yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
