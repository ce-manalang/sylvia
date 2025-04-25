"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import type { Answer, Question, User } from "@/lib/types"

interface AnswerReviewProps {
  answer: Answer
  question: Question
  currentUser: User
  onRateAnswer: (answerId: string, rating: number) => void
  onFinishReview: () => void
  isLastAnswer: boolean
}

export default function AnswerReview({
  answer,
  question,
  currentUser,
  onRateAnswer,
  onFinishReview,
  isLastAnswer,
}: AnswerReviewProps) {
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [hasRated, setHasRated] = useState<boolean>(false)

  // Check if current user has already rated this answer
  const hasAlreadyRated = answer.ratings && answer.ratings[currentUser.id] !== undefined

  const handleRate = () => {
    if (selectedRating > 0 && !hasAlreadyRated) {
      onRateAnswer(answer.questionId, selectedRating)
      setHasRated(true)
    }
  }

  const handleContinue = () => {
    onFinishReview()
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Answer Review</CardTitle>
          <Badge variant="outline" className="text-sm">
            Level {question.level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-lg font-medium mb-2">{question.text}</div>
          {question.context && <div className="text-sm text-gray-600 italic">{question.context}</div>}
        </div>

        <div className="border-l-4 border-purple-300 pl-4 py-2">
          <div className="flex items-center mb-2">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback>{answer.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{answer.username}'s answer:</span>
          </div>
          <p className="whitespace-pre-wrap">{answer.text}</p>
        </div>

        {!hasAlreadyRated && !hasRated ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="mb-2">Rate this answer:</p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    className={`p-2 rounded-full transition-all ${
                      selectedRating >= rating ? "text-yellow-500 scale-110" : "text-gray-300 hover:text-yellow-300"
                    }`}
                  >
                    <Star className="h-8 w-8" />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {selectedRating === 1 && "Needs improvement"}
                {selectedRating === 2 && "Acceptable"}
                {selectedRating === 3 && "Good"}
                {selectedRating === 4 && "Very good"}
                {selectedRating === 5 && "Excellent"}
              </p>
            </div>

            <Button className="w-full" onClick={handleRate} disabled={selectedRating === 0}>
              Submit Rating
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 p-3 rounded-md text-center">
              <p className="text-green-700">
                {hasAlreadyRated ? "You've already rated this answer" : "Rating submitted!"}
              </p>
              {answer.averageRating && (
                <div className="flex items-center justify-center mt-2">
                  <p className="mr-2">Average rating:</p>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="ml-1 font-medium">{answer.averageRating.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </div>

            <Button className="w-full" onClick={handleContinue}>
              {isLastAnswer ? "Finish Review" : "Next Answer"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
