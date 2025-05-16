"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useMounted } from "@/hooks/use-mounted"

export default function Home() {
  const [roomCode, setRoomCode] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const mounted = useMounted()

  const handleJoinRoom = () => {
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    if (!roomCode.trim()) {
      setError("Please enter a room code")
      return
    }

    router.push(`/room/${roomCode}?username=${encodeURIComponent(username)}`)
  }

  const handleCreateRoom = async () => {
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    // Generate a deterministic room code based on username and timestamp
    const generateRoomCode = () => {
      if (!mounted) return "LOADING"

      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      const timestamp = new Date().getTime().toString()
      const seed = username + timestamp
      let result = ""

      // Use a deterministic algorithm based on the seed
      for (let i = 0; i < 6; i++) {
        const charIndex = (seed.charCodeAt(i % seed.length) + i) % chars.length
        result += chars.charAt(charIndex)
      }

      return result
    }

    const newRoomCode = generateRoomCode()
    router.push(`/room/${newRoomCode}?username=${encodeURIComponent(username)}&isHost=true`)
  }

  // Show a simple loading state during SSR and hydration
  if (!mounted) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-blue-50">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-blue-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-purple-800">YASCG</CardTitle>
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
              aria-invalid={error.includes("username")}
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
              aria-invalid={error.includes("room code")}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm" data-testid="error-message">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-white" onClick={handleJoinRoom}>
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
          <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-white" onClick={handleCreateRoom}>
            Create New Room
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
