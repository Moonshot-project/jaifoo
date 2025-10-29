"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PersonalityBubble, PersonalityMiniGameProps } from "./types";

export default function PersonalityBubbleGame({
    title,
    subtitle,
    maxSelections,
    bubbles,
    onComplete,
}: PersonalityMiniGameProps) {
    const [selectedBubbles, setSelectedBubbles] = useState<Set<string>>(
        new Set(),
    );

    const handleBubbleClick = (bubbleId: string) => {
        setSelectedBubbles((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(bubbleId)) {
                newSet.delete(bubbleId);
            } else {
                if (newSet.size < maxSelections) {
                    newSet.add(bubbleId);
                }
            }
            return newSet;
        });
    };

    const handleComplete = () => {
        onComplete(Array.from(selectedBubbles));
    };

    const getBubbleSize = (size: "small" | "medium" | "large") => {
        switch (size) {
            case "small":
                return "w-24 h-24 text-sm";
            case "medium":
                return "w-32 h-32 text-base";
            case "large":
                return "w-40 h-40 text-lg";
            default:
                return "w-32 h-32 text-base";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex flex-col">
            {/* Header */}
            <div className="text-center pt-8 pb-6 px-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {title}
                </h1>
                <p className="text-base text-gray-600">{subtitle}</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-gray-700">
                        Selected: {selectedBubbles.size} / {maxSelections}
                    </span>
                </div>
            </div>

            {/* Bubble Container */}
            <div className="flex-1 relative px-6 py-8 max-w-2xl mx-auto w-full">
                {bubbles.map((bubble) => {
                    const isSelected = selectedBubbles.has(bubble.id);
                    const sizeClass = getBubbleSize(bubble.size);

                    return (
                        <button
                            key={bubble.id}
                            onClick={() => handleBubbleClick(bubble.id)}
                            className={`absolute ${sizeClass} rounded-full flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                                isSelected
                                    ? "bg-yellow-400 border-4 border-yellow-500 shadow-xl"
                                    : "bg-gray-200 border-2 border-gray-300 hover:bg-gray-300"
                            }`}
                            style={{
                                left: `${bubble.position.x}%`,
                                top: `${bubble.position.y}%`,
                                transform: `translate(-50%, -50%) ${isSelected ? "scale(1.1)" : "scale(1)"}`,
                            }}
                            disabled={
                                !isSelected &&
                                selectedBubbles.size >= maxSelections
                            }
                        >
                            <span className="text-3xl mb-1">{bubble.emoji}</span>
                            <span
                                className={`font-medium ${
                                    isSelected ? "text-gray-900" : "text-gray-700"
                                }`}
                            >
                                {bubble.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Bottom Button */}
            <div className="p-6 max-w-md mx-auto w-full">
                <Button
                    onClick={handleComplete}
                    disabled={selectedBubbles.size === 0}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 px-6 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {selectedBubbles.size === 0
                        ? `Select at least 1 item`
                        : selectedBubbles.size === maxSelections
                          ? "Continue"
                          : `Continue (${selectedBubbles.size} selected)`}
                </Button>
            </div>
        </div>
    );
}
