import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { QuizQuestion } from "./types";

interface ActiveQuizPageProps {
    currentQuestion: QuizQuestion;
    timeLeft: number;
    selectedChoice: number | null;
    onSelect: (choiceIndex: number) => void;
}

export default function ActiveQuizPage({
    currentQuestion,
    timeLeft,
    selectedChoice,
    onSelect,
}: ActiveQuizPageProps) {
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

            <main className="flex flex-col items-center justify-center px-6 py-8 max-w-lg mx-auto">
                <div className="mb-8 text-center">
                    <div className="mb-2">
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {currentQuestion.category}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 text-balance">
                        {currentQuestion.question}
                    </h1>
                </div>

                <div className="w-full space-y-4 mb-8">
                    {currentQuestion.choices.map((choice, index) => (
                        <Button
                            key={index}
                            onClick={() => onSelect(index)}
                            disabled={selectedChoice !== null}
                            className={`w-full min-h-[80px] p-6 text-left rounded-xl border-2 transition-all ${
                                selectedChoice === index
                                    ? "bg-yellow-400 border-yellow-400 text-gray-900"
                                    : selectedChoice !== null
                                      ? "bg-gray-100 border-gray-200 text-gray-500"
                                      : "bg-white border-gray-200 hover:border-yellow-400 hover:bg-yellow-400 text-gray-900"
                            }`}
                            variant="ghost"
                        >
                            <div className="flex items-start justify-between gap-4 w-full">
                                <span className="text-lg font-medium flex-1 break-words whitespace-normal">
                                    {choice.label}
                                </span>
                                <span className="text-sm text-gray-500 flex-shrink-0">
                                    {index + 1}
                                </span>
                            </div>
                        </Button>
                    ))}
                </div>

                <div className="w-full">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <img
                                src="/cute-yellow-hamster-character-with-brown-outline--.jpg"
                                alt="Jaifoo mascot"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-yellow-400 h-3 rounded-full transition-all duration-1000 ease-linear"
                                    style={{
                                        width: `${
                                            (timeLeft /
                                                currentQuestion.timeLimitSec) *
                                            100
                                        }%`,
                                    }}
                                />
                            </div>
                            <div className="text-sm text-gray-600 mt-1 text-center">
                                {timeLeft}s remaining
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Use keyboard shortcuts: 1, 2, 3
                    </p>
                </div>
            </main>
        </div>
    );
}
