"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { GameResultUI } from "@/lib/game-results"

// Sample result data matching the design
const knightResult: GameResultUI = {
  id: "knight",
  title: "The cat blinked slowly, as if trying to convince the world that naps were a form of higher wisdom.",
  description:
    "The cat blinked slowly. Engines roared as the silver craft split the sky, leaving streaks of light like glowing scars in the night. 'ly, as if trying to convince the world that naps were a form of higher wisdom.",
  imageUrl: "/images/knight-character.png",
  themeColors: ["#6366f1", "#8b5cf6"], // indigo to purple gradient
  stats: {
    stressScore: 70,
    happinessScore: 70,
    cash: 70,
  },
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const stress = searchParams.get("stress") || "70"
  const happiness = searchParams.get("happiness") || "70"
  const cash = searchParams.get("cash") || "70"

  // Use actual scores if provided, otherwise use default
  const result: GameResultUI = {
    ...knightResult,
    stats: {
      stressScore: Math.min(100, Math.max(0, Number.parseInt(stress))),
      happinessScore: Math.min(100, Math.max(0, Number.parseInt(happiness))),
      cash: Math.min(100, Math.max(0, Number.parseInt(cash))),
    },
  }

  const shareResult = (platform: string) => {
    const shareText = `I just completed the Jaifoo personality quiz! My results: Stress ${result.stats.stressScore}%, Happiness ${result.stats.happinessScore}%, Cash ${result.stats.cash}%`
    const shareUrl = window.location.href

    switch (platform) {
      case "line":
        window.open(
          `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          "_blank",
        )
        break
      case "instagram":
        // Instagram doesn't support direct URL sharing, so copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        alert("Result copied to clipboard! You can paste it in your Instagram story or post.")
        break
      case "x":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank",
        )
        break
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
          "_blank",
        )
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-6 max-w-6xl mx-auto">
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

      <div className="flex flex-col items-center justify-center px-6 py-8">
        {/* Result Card */}
        <div
          className="rounded-3xl shadow-lg overflow-hidden"
          style={{
            background: `linear-gradient(to bottom, ${result.themeColors[0]}, ${result.themeColors[1]})`,
          }}
        >
          {/* Character Image */}
          <div className="pt-8 pb-6 flex justify-center">
            <img
              src={result.imageUrl || "/placeholder.svg"}
              alt="Result character"
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* Content */}
          <div className="px-6 pb-8 text-white">
            {/* Title Quote */}
            <h1 className="text-lg font-medium mb-4 text-center leading-relaxed">"{result.title}"</h1>

            {/* Description */}
            <p className="text-sm opacity-90 mb-6 leading-relaxed">{result.description}</p>

            {/* Stats */}
            <div className="space-y-3">
              {/* Stress Score */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${result.stats.stressScore}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium w-10 text-right">{result.stats.stressScore}%</span>
              </div>

              {/* Happiness Score */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${result.stats.happinessScore}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium w-10 text-right">{result.stats.happinessScore}%</span>
              </div>

              {/* Cash Score */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${result.stats.cash}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium w-10 text-right">{result.stats.cash}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-center gap-3">
            <button
              onClick={() => shareResult("line")}
              className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Share on LINE"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
            </button>

            <button
              onClick={() => shareResult("instagram")}
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Share on Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.057-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </button>

            <button
              onClick={() => shareResult("x")}
              className="w-12 h-12 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Share on X (Twitter)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>

            <button
              onClick={() => shareResult("facebook")}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Share on Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-6 mb-6">
          <p className="text-gray-700 text-sm">Next Round or Deep Talk with น้องใจฟู which feels right, ค่ะ?</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-full"
            asChild
          >
            <Link
              href={`/deep-talk?stress=${result.stats.stressScore}&happiness=${result.stats.happinessScore}&cash=${result.stats.cash}`}
            >
              Deep talk
            </Link>
          </Button>
          <Button
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-full"
            asChild
          >
            <Link href="/quiz">Next round</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
