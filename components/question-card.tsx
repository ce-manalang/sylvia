"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { Question, User } from "@/lib/types"

interface QuestionCardProps {
  question: Question
  targetUser: User
  onSubmit: (answer: string) => void
}

export default function QuestionCard({ question, targetUser, onSubmit }: QuestionCardProps) {
  const [answerText, setAnswerText] = useState<string>("")
  const [charCount, setCharCount] = useState<number>(0)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setAnswerText(text)
    setCharCount(text.length)
  }

  const handleSubmit = () => {
    if (answerText.trim()) {
      onSubmit(answerText.trim())
    }
  }

  // Format the question text to include the target user's name
  const formattedQuestion = question.text.replace("[name]", targetUser.name + "'s")

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="text-sm">
          {question.category || "General"}
        </Badge>
        <Badge variant="outline" className="text-sm">
          Level {question.level}
        </Badge>
      </div>

      <div className="text-xl font-medium">
        <span>
          Question about <span className="font-bold text-purple-700">{targetUser.name}</span>:
          <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md text-purple-800">
            "{formattedQuestion}"
          </div>
        </span>
      </div>

      {question.context && (
        <div className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-md">{question.context}</div>
      )}

      <Textarea
        placeholder="Write your answer here..."
        className="min-h-[150px] resize-y"
        value={answerText}
        onChange={handleTextChange}
      />

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{charCount} characters</span>
      </div>

      <Button className="w-full" onClick={handleSubmit} disabled={!answerText.trim()}>
        Submit Answer
      </Button>
    </div>
  )
}
