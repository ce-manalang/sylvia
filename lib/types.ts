export interface User {
  id: string
  name: string
  isHost: boolean
  score: number
}

export interface Question {
  id: string
  text: string
  level: number // 1, 2, or 3 for difficulty
  category?: string
  context?: string // Additional context or background for the question
}

export interface Message {
  id: string
  userId: string
  username: string
  text: string
  timestamp: Date
  type: "user" | "system" | "question" | "answer"
}

export interface Answer {
  id: string
  questionId: string
  targetUserId: string
  userId: string
  username: string
  text: string
  timestamp: Date
}
