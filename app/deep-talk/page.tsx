"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useMemo, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { GameResultUI } from "@/lib/game-results";
import {
    fetchDeepTalkAI,
    type ReflectionMessage,
} from "@/app/actions/fetchDeepTalkAI";

export default function DeepTalkPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [conversationHistory, setConversationHistory] = useState<ReflectionMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get user's result data from URL params
  const stress = searchParams.get("stress") || "70"
  const happiness = searchParams.get("happiness") || "70"
  const cash = searchParams.get("cash") || "70"

  const result: GameResultUI | null = useMemo(() => {
    // Only create result if conversation history exists
    if (conversationHistory.length === 0) {
      return null
    }

    return {
      id: "knight",
      title: conversationHistory[0]?.header || "Deep Talk Session",
      description: conversationHistory[conversationHistory.length - 1]?.messages || "Conversation in progress",
      imageUrl: "/images/knight-character.png",
      themeColors: ["#6366f1", "#8b5cf6"],
      stats: {
        stressScore: Math.min(100, Math.max(0, Number.parseInt(stress))),
        happinessScore: Math.min(100, Math.max(0, Number.parseInt(happiness))),
        cash: Math.min(100, Math.max(0, Number.parseInt(cash))),
      },
    }
  }, [conversationHistory, stress, happiness, cash])

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize with API greeting
  useEffect(() => {
    const loadInitialGreeting = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("jaifoo_jwt_token")

        if (!token) {
          throw new Error("No authentication token found")
        }

        // Initial request with empty string userInput to get the first greeting
        const initialReflectionMessage: ReflectionMessage = {
          header: "Welcome to Deep Talk",
          messages: "Starting conversation",
          inputGuide: "Share what's on your mind",
          options: {
            id: "start_conversation",
            label: "Start",
            icon: "💬",
          },
          userInput: "",
    const stress = searchParams.get("stress") || "70";
    const happiness = searchParams.get("happiness") || "70";
    const cash = searchParams.get("cash") || "70";

    // const result: GameResultUI | null = useMemo(() => {
    //     // Only create result if conversation history exists
    //     if (conversationHistory.length === 0) {
    //         return null;
    //     }

    //     return {
    //         id: "knight",
    //         title: conversationHistory[0]?.header || "Deep Talk Session",
    //         description:
    //             conversationHistory[conversationHistory.length - 1]?.messages ||
    //             "Conversation in progress",
    //         imageUrl: "/images/knight-character.png",
    //         themeColors: ["#6366f1", "#8b5cf6"],
    //         stats: {
    //             stressScore: Math.min(
    //                 100,
    //                 Math.max(0, Number.parseInt(stress))
    //             ),
    //             happinessScore: Math.min(
    //                 100,
    //                 Math.max(0, Number.parseInt(happiness))
    //             ),
    //             cash: Math.min(100, Math.max(0, Number.parseInt(cash))),
    //         },
    //     };
    // }, [conversationHistory, stress, happiness, cash]);

    // Scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversationHistory]);

    // Initialize with API greeting
    useEffect(() => {
        if (conversationHistory.length > 0) return;
        const loadInitialGreeting = async () => {
            try {
                setIsLoading(true);
                await handleSendMessage();
            } catch (error) {
                console.error("Error loading initial greeting:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialGreeting();
    }, []);

    const handleSendMessage = async () => {
        // Skip if empty input and conversation already exists
        if (!inputText.trim() && conversationHistory.length > 0) return;

        console.log("Sending message");
        console.log("User input:", inputText);

        const currentInput = inputText;
        setInputText("");
        setIsLoading(true);

        try {
            // Get JWT token from localStorage
            const token = localStorage.getItem("jaifoo_jwt_token");

            if (!token) {
                throw new Error("No authentication token found");
            }

            // For initial greeting (empty history), use empty array
            // Otherwise, update the last conversation item with user input
            const updatedHistory =
                conversationHistory.length === 0
                    ? []
                    : conversationHistory.map((item, index) => {
                          if (index === conversationHistory.length - 1) {
                              return { ...item, userInput: currentInput };
                          }
                          return item;
                      });

            // Update conversation history immediately to show user input in UI
            if (conversationHistory.length > 0) {
                setConversationHistory(updatedHistory);
            }

            console.log("Sending :", updatedHistory);

            const response = await fetchDeepTalkAI(
                { reflectionMessages: updatedHistory },
                token
            );

            // Create new reflection message from response
            const newReflectionMessage: ReflectionMessage = {
                header: response.data.header,
                messages: response.data.messages,
                inputGuide: response.data.inputGuide,
                options: response.data.options,
                userInput: "",
            };

            // Update conversation history
            updatedHistory.push(newReflectionMessage);
            setConversationHistory(updatedHistory);
        } catch (error) {
            console.error("Error fetching DeepTalk AI:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("Updated conversationHistory:", conversationHistory);
    }, [conversationHistory]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // const handleBack = () => {
    //     if (!result) return;

    //     const params = new URLSearchParams({
    //         stress: result.stats.stressScore.toString(),
    //         happiness: result.stats.happinessScore.toString(),
    //         cash: result.stats.cash.toString(),
    //     });
    //     router.push(`/results?${params.toString()}`);
    // };

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-2xl h-[90vh] bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
                    <div className="bg-white px-6 py-8 flex flex-col items-center gap-4 flex-shrink-0 ">
                        <img
                            src="./images/jaifooTaking.png"
                            alt="Jaifoo"
                            className="w-70 h-70 object-contain"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 border-b border-gray-100">
                        {isLoading && conversationHistory.length === 0 ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-gray-500">Loading...</div>
                            </div>
                        ) : (
                            <>
                                {conversationHistory.map((item, index) => (
                                    <div key={index} className="space-y-6">
                                        <div className="flex justify-center">
                                            <div className="w-full max-w-xl px-6 py-4 rounded-3xl bg-[#d9d9d9] text-gray-900">
                                                <p className="text-base leading-relaxed whitespace-pre-wrap">
                                                    {item.messages}
                                                </p>
                                            </div>
                                        </div>

                                        {item.userInput ?? (
                                            <div className="flex justify-center">
                                                <div className="w-full max-w-xl px-6 py-4 rounded-3xl bg-[#ffc92b] text-gray-900">
                                                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                                                        {item.userInput}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    <div className="bg-white px-6 py-6 flex-shrink-0 border-t-2 border-gray-200">
                        <div className="flex gap-3 items-center">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) =>
                                        setInputText(e.target.value)
                                    }
                                    onKeyPress={handleKeyPress}
                                    placeholder={isLoading ? "Waiting for response..." : "Type a message..."}
                                    disabled={isLoading}
                                    className="w-full px-6 py-4 bg-[#d9d9d9] text-gray-900 placeholder:text-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ffc92b] disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputText.trim() || isLoading}
                                className="bg-transparent hover:bg-transparent rounded-full p-0 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed border-0"
                                size="icon"
                            >
                                <img
                                    src="/images/jaifoo_button.png"
                                    alt="Send"
                                    className="w-14 h-14 object-contain"
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
