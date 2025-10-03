"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
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
        return `Hi there! I can see your happiness is glowing at ${happinessScore}%! That's wonderful. What's been bringing you the most joy lately?`
      } else if (stressScore >= 70) {
        return `Hey friend. I notice your stress levels are at ${stressScore}%. I'm here to listen and help you work through whatever's on your mind. Want to talk about it?`
      } else if (cash >= 70) {
        return `Hello! I see you're doing well financially at ${cash}%! That's great progress. Are you thinking about your next financial goals?`
      } else {
        return `Hi there! Thanks for sharing your journey with me. I'm here to chat about whatever's on your mind - whether it's about stress, happiness, money, or just life in general. What would you like to explore together?`
      }
    }

    const initialMessage: Message = {
      id: "1",
      text: getPersonalizedGreeting(),
      isUser: false,
      timestamp: new Date(),
    }

    setMessages([initialMessage])
  }, [result])

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
        "I understand. It sounds like you're going through a lot right now.",
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
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl h-[90vh] bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
          <div className="bg-white px-6 py-8 flex flex-col items-center gap-4 flex-shrink-0 ">
            <img src="./images/jaifooTaking.png" alt="Jaifoo" className="w-70 h-70 object-contain" />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 border-b border-gray-100">
            {messages.map((message) => (
              <div key={message.id} className="flex justify-center">
                <div
                  className={`w-full max-w-xl px-6 py-4 rounded-3xl ${
                    message.isUser ? "bg-[#ffc92b] text-gray-900" : "bg-[#d9d9d9] text-gray-900"
                  }`}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white px-6 py-6 flex-shrink-0 border-t-2 border-gray-200">
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full px-6 py-4 bg-[#d9d9d9] text-gray-900 placeholder:text-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ffc92b]"
                />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-transparent hover:bg-transparent rounded-full p-0 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed border-0"
                size="icon"
              >
                <img src="/images/jaifoo_button.png" alt="Send" className="w-14 h-14 object-contain" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
