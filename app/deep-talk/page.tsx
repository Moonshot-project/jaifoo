"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { GameResultUI } from "@/lib/game-results"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function DeepTalkPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get user's result data from URL params
  const stress = searchParams.get("stress") || "70"
  const happiness = searchParams.get("happiness") || "70"
  const cash = searchParams.get("cash") || "70"

  const result: GameResultUI = useMemo(
    () => ({
      id: "knight",
      title: "The cat blinked slowly, as if trying to convince the world that naps were a form of higher wisdom.",
      description:
        "The cat blinked slowly. Engines roared as the silver craft split the sky, leaving streaks of light like glowing scars in the night.",
      imageUrl: "/images/knight-character.png",
      themeColors: ["#6366f1", "#8b5cf6"],
      stats: {
        stressScore: Math.min(100, Math.max(0, Number.parseInt(stress))),
        happinessScore: Math.min(100, Math.max(0, Number.parseInt(happiness))),
        cash: Math.min(100, Math.max(0, Number.parseInt(cash))),
      },
    }),
    [stress, happiness, cash],
  )

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize with Jaifoo's greeting
  useEffect(() => {
    const getPersonalizedGreeting = () => {
      const { stressScore, happinessScore, cash } = result.stats

      if (happinessScore >= 70) {
        return `Hi there! 🌟 I can see your happiness is glowing at ${happinessScore}%! That's wonderful. What's been bringing you the most joy lately?`
      } else if (stressScore >= 70) {
        return `Hey friend 💙 I notice your stress levels are at ${stressScore}%. I'm here to listen and help you work through whatever's on your mind. Want to talk about it?`
      } else if (cash >= 70) {
        return `Hello! 💰 I see you're doing well financially at ${cash}%! That's great progress. Are you thinking about your next financial goals?`
      } else {
        return `Hi there! 😊 Thanks for sharing your journey with me. I'm here to chat about whatever's on your mind - whether it's about stress, happiness, money, or just life in general. What would you like to explore together?`
      }
    }

    const initialMessage: Message = {
      id: "1",
      text: getPersonalizedGreeting(),
      isUser: false,
      timestamp: new Date(),
    }

    setMessages([initialMessage])
  }, [result]) // Now using the memoized result object

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")

    // Simulate Jaifoo's response after a short delay
    setTimeout(() => {
      const responses = [
        "That's really interesting! Tell me more about how that makes you feel.",
        "I understand. It sounds like you're going through a lot right now. 💙",
        "That's a great perspective! What do you think your next step might be?",
        "I hear you. Sometimes it helps to break things down into smaller pieces. What feels most manageable right now?",
        "Thank you for sharing that with me. You're being really brave by opening up about this.",
        "That sounds challenging. What kind of support do you think would help you most?",
        "I can see why that would be important to you. What does success look like in this situation?",
        "It's okay to feel that way. What usually helps you when you're feeling like this?",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const jaifooMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, jaifooMessage])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleBack = () => {
    const params = new URLSearchParams({
      stress: result.stats.stressScore.toString(),
      happiness: result.stats.happinessScore.toString(),
      cash: result.stats.cash.toString(),
    })
    router.push(`/results?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between p-6 max-w-6xl mx-auto bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Jaifoo</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="bg-[#ffc92b] hover:bg-[#ffc92a] text-gray-900 rounded-lg w-10 h-10">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Link href="#" className="w-full">
                Products
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#contact" className="w-full">
                Contact us
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#" className="w-full">
                Report problems
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/signup" className="w-full">
                Join wait list
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-2xl h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="bg-white shadow-sm border-b px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>

            <div className="flex items-center gap-3 flex-1">
              <img
                src="/cute-yellow-hamster-character-with-brown-outline--.jpg"
                alt="Jaifoo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h1 className="font-semibold text-gray-900">Talk with Jaifoo</h1>
                <p className="text-sm text-gray-500">Your financial buddy</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/signup")}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              End Chat
            </Button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.isUser ? "flex-row-reverse" : "flex-row"}`}>
                  {!message.isUser && (
                    <img
                      src="/cute-yellow-hamster-character-with-brown-outline--.jpg"
                      alt="Jaifoo"
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}

                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.isUser
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white text-gray-900 shadow-sm border rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="bg-white border-t px-4 py-3 flex-shrink-0">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your thoughts…"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={1}
                  style={{ minHeight: "44px", maxHeight: "120px" }}
                />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 flex-shrink-0"
                size="sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
