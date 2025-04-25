"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function Home() {
  const [roomCode, setRoomCode] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      setError("Please enter a room code")
      return
    }

    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    router.push(`/room/${roomCode}?username=${encodeURIComponent(username)}`)
  }

  const handleCreateRoom = async () => {
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    // Generate a random 6-character room code
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    router.push(`/room/${newRoomCode}?username=${encodeURIComponent(username)}&isHost=true`)
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-blue-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-purple-800">Question Card Game</CardTitle>
          <CardDescription>Join a room or create your own to start playing!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Your Name
            </label>
            <Input
              id="username"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 text-base select-text"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="roomCode" className="text-sm font-medium">
              Room Code
            </label>
            <Input
              id="roomCode"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="h-12 text-base select-text"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-base" onClick={handleJoinRoom}>
            Join Room
          </Button>
          <div className="relative w-full text-center my-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base" onClick={handleCreateRoom}>
            Create New Room
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
