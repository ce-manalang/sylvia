"use client"

import type { User } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, MessageSquare } from "lucide-react"

interface UserListProps {
  users: User[]
  currentUser: User | null
  onShowAnswers: (userId: string) => void
  hasAnswers: (userId: string) => boolean
}

export default function UserList({ users, currentUser, onShowAnswers, hasAnswers }: UserListProps) {
  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 active:bg-gray-100"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <span className="font-medium select-text">{user.name}</span>
                {user.isHost && <Crown className="h-4 w-4 text-yellow-500 ml-1" />}
                {user.id === currentUser?.id && (
                  <Badge variant="outline" className="ml-1 text-xs">
                    You
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-500">{user.score} points</div>
            </div>
          </div>

          {user.id !== currentUser?.id && hasAnswers(user.id) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShowAnswers(user.id)}
              title="View answers about this user"
              className="h-8 w-8"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      {users.length === 0 && <div className="text-center p-4 text-gray-500">No players have joined yet</div>}
    </div>
  )
}
