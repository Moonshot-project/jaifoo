"use client";

import type React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useMemo, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { GameResultUI } from "@/lib/game-results";
import {
    fetchDeepTalkAI,
    type ReflectionMessage,
} from "@/app/actions/fetchDeepTalkAI";
import Link from "next/link";

export default function DeepTalkPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [inputText, setInputText] = useState("");
    const [inputGuide, setInputGuide] = useState("Type a message...");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [conversationHistory, setConversationHistory] = useState<
        ReflectionMessage[]
    >([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        setError(null); // Clear any previous errors

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

            setInputGuide(response.data.inputGuide || "Type a message...");

            // Update conversation history
            updatedHistory.push(newReflectionMessage);
            setConversationHistory(updatedHistory);
        } catch (error) {
            console.error("Error fetching DeepTalk AI:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch response. Please try again."
            );
            // Restore the input text if there was an error
            if (currentInput) {
                setInputText(currentInput);
            }
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

    const handleRetry = () => {
        setError(null);
        handleSendMessage();
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="flex items-center justify-between p-6 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900">Jaifoo</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="icon"
                            className="bg-[#ffc92b] hover:bg-[#ffc92a] text-gray-900 rounded-lg w-10 h-10"
                        >
                            <MoreVertical className="h-5 w-5" />
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

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center px-6 py-2 max-w-md mx-auto">
                <div className="w-full max-w-2xl h-[70vh] bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
                    <div className="bg-white px-6 py-4 flex flex-col items-center gap-4 flex-shrink-0 relative">
                        <Button
                            className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-2 py-2 rounded-full text-sm"
                            asChild
                        >
                            <Link href="/signup">End Deep Talk</Link>
                        </Button>
                        <img
                            src="./images/jaifooTaking.png"
                            alt="Jaifoo"
                            className="w-auto h-40 object-contain"
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

                                        {item.userInput && (
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
                        {error ? (
                            <div className="flex flex-col gap-3">
                                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-800 text-center">
                                        {error}
                                    </p>
                                </div>
                                <Button
                                    onClick={handleRetry}
                                    disabled={isLoading}
                                    className="w-full bg-[#ffc92b] hover:bg-[#ffc92a] text-gray-900 font-medium py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Retrying..." : "Retry"}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-3 items-center">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) =>
                                            setInputText(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        placeholder={
                                            isLoading
                                                ? "Waiting for response..."
                                                : inputGuide
                                        }
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
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
