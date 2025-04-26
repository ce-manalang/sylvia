"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Message, User } from "@/lib/types"
import { useMounted } from "@/hooks/use-mounted"

interface ExtendedMessage extends Message {
  questionId?: string
  targetUserId?: string
  level?: number
  category?: string
}

interface ChatMessageProps {
  message: ExtendedMessage
  isCurrentUser: boolean
  onAnswer?: () => void
  currentUser: User | null
}

export default function ChatMessage({ message, isCurrentUser, onAnswer, currentUser }: ChatMessageProps) {
  const mounted = useMounted()

  // Only format time on the client after mounting to avoid hydration mismatch
  const formattedTime = mounted
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(new Date(message.timestamp))
    : "00:00 AM"

  if (message.type === "system") {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-100 text-gray-600 text-xs py-1 px-3 rounded-full">{message.text}</div>
      </div>
    )
  }

  if (message.type === "question") {
    return (
      <div className="flex justify-center my-3">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 w-full max-w-[95%] shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {message.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Level {message.level}
              </Badge>
            </div>
            <span className="text-xs text-gray-500" suppressHydrationWarning>
              {formattedTime}
            </span>
          </div>

          <div className="text-base font-medium text-purple-800 mb-2">"{message.text}"</div>

          {mounted && onAnswer && currentUser && message.targetUserId !== currentUser.id && (
            <div className="text-xs text-gray-600 mt-2">Type your answer in the chat to respond to this question.</div>
          )}

          {mounted && currentUser && message.targetUserId === currentUser.id && (
            <div className="text-xs text-gray-600 mt-2">
              This question is about you. Your co-players will answer it.
            </div>
          )}
        </div>
      </div>
    )
  }

  if (message.type === "answer" && message.questionId) {
    return (
      <div className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}>
        <div className={cn("flex max-w-[85%]", isCurrentUser ? "flex-row-reverse" : "flex-row")}>
          <Avatar className={cn("h-7 w-7", isCurrentUser ? "ml-2" : "mr-2")}>
            <AvatarFallback>{message.username.charAt(0)}</AvatarFallback>
          </Avatar>

          <div>
            <div className={cn("flex items-center", isCurrentUser ? "justify-end" : "justify-start")}>
              <span className="text-xs text-gray-500" suppressHydrationWarning>
                {!isCurrentUser && `${message.username} • `}
                {formattedTime}
              </span>
            </div>

            <div
              className={cn(
                "mt-1 p-2 rounded-lg text-sm select-text",
                isCurrentUser
                  ? "bg-purple-600 text-white rounded-tr-none"
                  : "bg-white border border-gray-200 rounded-tl-none",
              )}
            >
              <div className="text-xs text-opacity-80 mb-1">{isCurrentUser ? "Your answer:" : "Answer:"}</div>
              {message.text}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[85%]", isCurrentUser ? "flex-row-reverse" : "flex-row")}>
        <Avatar className={cn("h-7 w-7", isCurrentUser ? "ml-2" : "mr-2")}>
          <AvatarFallback>{message.username.charAt(0)}</AvatarFallback>
        </Avatar>

        <div>
          <div className={cn("flex items-center", isCurrentUser ? "justify-end" : "justify-start")}>
            <span className="text-xs text-gray-500" suppressHydrationWarning>
              {!isCurrentUser && `${message.username} • `}
              {formattedTime}
            </span>
          </div>

          <div
            className={cn(
              "mt-1 p-2 rounded-lg text-sm select-text",
              isCurrentUser
                ? "bg-purple-600 text-white rounded-tr-none"
                : "bg-white border border-gray-200 rounded-tl-none",
            )}
          >
            {message.text}
          </div>
        </div>
      </div>
    </div>
  )
}
