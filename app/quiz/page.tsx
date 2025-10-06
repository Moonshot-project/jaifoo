"use client";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { fetchQuestions } from "@/app/actions/questions";
import { fetchResults as fetchResultsFromServer } from "@/app/actions/results";

interface QuizChoice {
    cash: number;
    happiness: number;
    label: string;
    stress: number;
    tag: string;
}

interface QuizQuestion {
    category: string;
    choices: QuizChoice[];
    question: string;
    question_id: number;
    question_number: number;
    timeLimitSec: number;
}

interface QuizAnswer {
    questionId: number;
    choiceIndex: number | null; // null if timeout
    timeSpentSec: number;
    isTimeout: boolean;
    selectedChoice?: QuizChoice;
}

interface UserQuizResults {
    question_and_answer: {
        questions: Array<{
            question_id: number;
            question_number: number;
            category: string;
            question: string;
            choices: Array<{
                label: string;
                cash: number;
                happiness: number;
                stress: number;
                tag: string;
            }>;
            timeLimitSec: number;
        }>;
        answers: Array<{
            question_id: number;
            question_number: number;
            label: string;
            cash: number;
            happiness: number;
            stress: number;
            tag: string;
        }>;
    };
}

interface GameResultUI {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    themeColors: [string, string];
    stats: {
        stressScore: number;
        happinessScore: number;
        cash: number;
    };
}

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
};

interface ApiResultResponse {
    code: number;
    data: {
        areaOfImprovement: string;
        epithetDescription: string;
        epithetName: string;
        image_file: string;
        keyinsight: string;
        strength: string;
        suggestion: string;
        updatedParam: {
            cash: number | null;
            financialStressIndex: number | null;
            happinessIndex: number | null;
        };
    } | null;
    success: boolean;
    message: string;
    error?: string;
}

export default function QuizPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(5);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const [userResults, setUserResults] = useState<UserQuizResults>({
        question_and_answer: {
            questions: [],
            answers: [],
        },
    });
    const [isComplete, setIsComplete] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [totals, setTotals] = useState({
        stress: 0,
        happiness: 0,
        cash: 15000,
    });
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
    const [userData, setUserData] = useState<{
        name: string;
        feelGoodValue: number;
        tightnessValue: number;
    } | null>(null);
    const [showTokenDialog, setShowTokenDialog] = useState(false);
    const [apiResults, setApiResults] = useState<
        ApiResultResponse["data"] | null
    >(null);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [resultsError, setResultsError] = useState<string | null>(null);
    const [roundNumber, setRoundNumber] = useState(1);

    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setIsLoadingQuestions(true);

                console.log("[v0] Checking for authentication token...");
                const token = localStorage.getItem("jaifoo_jwt_token");
                console.log("[v0] Token found:", token ? "Yes" : "No");

                if (!token) {
                    console.log("[v0] No token found, showing dialog...");
                    setShowTokenDialog(true);
                    setIsLoadingQuestions(false);
                    return;
                }

                console.log("[v0] Fetching questions with server action...");
                const result = await fetchQuestions(token);

                if (!result.success || !result.data) {
                    throw new Error(
                        result.error || "Failed to fetch questions"
                    );
                }

                console.log(
                    "[v0] Questions fetched successfully:",
                    result.data.length
                );

                setQuestions(result.data!);
                setUserResults((prev) => ({
                    question_and_answer: {
                        ...prev.question_and_answer,
                        questions: result.data!.map((q) => ({
                            question_id: q.question_id,
                            question_number: q.question_number,
                            category: q.category,
                            question: q.question,
                            choices: q.choices, // Store all choices array
                            timeLimitSec: q.timeLimitSec,
                        })),
                    },
                }));
                if (result.data!.length > 0) {
                    setTimeLeft(result.data![0].timeLimitSec);
                }
            } catch (error) {
                console.error("[v0] Failed to load questions:", error);
                if (
                    error instanceof Error &&
                    error.message.includes("authentication")
                ) {
                    localStorage.removeItem("jaifoo_jwt_token");
                    setShowTokenDialog(true);
                }
            } finally {
                setIsLoadingQuestions(false);
            }
        };

        loadQuestions();
    }, []);

    const handleGoToPersonalization = () => {
        window.location.href = "/personalization";
    };

    const handleStayOnQuiz = () => {
        setShowTokenDialog(false);
    };

    const handleSelect = useCallback(
        (choiceIndex: number | null) => {
            if (selectedChoice !== null) return;

            setSelectedChoice(choiceIndex);

            const choice =
                choiceIndex !== null
                    ? currentQuestion.choices[choiceIndex]
                    : null;
            const answer: QuizAnswer = {
                questionId: currentQuestion.question_id,
                choiceIndex,
                timeSpentSec: currentQuestion.timeLimitSec - timeLeft,
                isTimeout: choiceIndex === null,
                selectedChoice: choice || undefined,
            };

            setAnswers((prev) => [...prev, answer]);

            if (choice) {
                setUserResults((prev) => ({
                    question_and_answer: {
                        ...prev.question_and_answer,
                        answers: [
                            ...prev.question_and_answer.answers,
                            {
                                question_id: currentQuestion.question_id,
                                question_number:
                                    currentQuestion.question_number,
                                label: choice.label,
                                cash: choice.cash,
                                happiness: choice.happiness,
                                stress: choice.stress,
                                tag: choice.tag,
                            },
                        ],
                    },
                }));

                setTotals((prev) => ({
                    stress: prev.stress + choice.stress,
                    happiness: prev.happiness + choice.happiness,
                    cash: prev.cash + choice.cash,
                }));
            }

            console.log("[v0] Current user results:", userResults);

            setTimeout(() => {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                    const nextQuestion = questions[currentQuestionIndex + 1];
                    setTimeLeft(nextQuestion.timeLimitSec);
                    setSelectedChoice(null);
                } else {
                    console.log("[v0] Final user results:", userResults);
                    setIsComplete(true);
                    fetchResults();
                }
            }, 300);
        },
        [
            currentQuestion,
            timeLeft,
            selectedChoice,
            currentQuestionIndex,
            questions,
            userResults,
        ]
    );

    const fetchResults = async () => {
        try {
            console.log("[v0] Starting results fetch...");
            setIsLoadingResults(true);
            setResultsError(null); // Clear previous errors

            const token = localStorage.getItem("jaifoo_jwt_token");

            if (!token) {
                throw new Error("No authentication token found");
            }

            // Get the final user results with all answers
            const finalResults = {
                ...userResults,
                question_and_answer: {
                    ...userResults.question_and_answer,
                    answers: [
                        ...userResults.question_and_answer.answers,
                        // Add the last answer if it exists
                        ...(selectedChoice !== null && currentQuestion
                            ? [
                                  {
                                      question_id: currentQuestion.question_id,
                                      question_number:
                                          currentQuestion.question_number,
                                      label: currentQuestion.choices[
                                          selectedChoice
                                      ].label,
                                      cash: currentQuestion.choices[
                                          selectedChoice
                                      ].cash,
                                      happiness:
                                          currentQuestion.choices[
                                              selectedChoice
                                          ].happiness,
                                      stress: currentQuestion.choices[
                                          selectedChoice
                                      ].stress,
                                      tag: currentQuestion.choices[
                                          selectedChoice
                                      ].tag,
                                  },
                              ]
                            : []),
                    ],
                },
            };

            console.log(
                "[v0] Fetching results with final data:",
                finalResults.question_and_answer
            );
            const result = await fetchResultsFromServer(
                token,
                finalResults.question_and_answer
            );

            console.log("[v0] Results fetch response:", result);

            if (result.success && result.data && result.data.data) {
                console.log("[v0] Results fetched successfully");
                setApiResults(result.data.data);
                setResultsError(null);
            } else {
                console.error("[v0] Results fetch failed:", result.error);
                setResultsError(
                    result.error || "Failed to fetch results from server"
                );
            }
        } catch (error) {
            console.error("[v0] Results fetch error:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred";
            setResultsError(errorMessage);
        } finally {
            setIsLoadingResults(false);
        }
    };

    const retryFetchResults = () => {
        console.log("[v0] Retrying results fetch...");
        fetchResults();
    };

    const handleNextRound = async () => {
        try {
            console.log("[v0] Starting next round...");
            setIsLoadingQuestions(true);
            setResultsError(null);

            const token = localStorage.getItem("jaifoo_jwt_token");

            if (!token) {
                console.log("[v0] No token found for next round");
                setShowTokenDialog(true);
                setIsLoadingQuestions(false);
                return;
            }

            // Get the final results with all Q&A
            const finalResults = {
                ...userResults,
                question_and_answer: {
                    ...userResults.question_and_answer,
                    answers: [
                        ...userResults.question_and_answer.answers,
                        ...(selectedChoice !== null && currentQuestion
                            ? [
                                  {
                                      question_id: currentQuestion.question_id,
                                      question_number:
                                          currentQuestion.question_number,
                                      label: currentQuestion.choices[
                                          selectedChoice
                                      ].label,
                                      cash: currentQuestion.choices[
                                          selectedChoice
                                      ].cash,
                                      happiness:
                                          currentQuestion.choices[
                                              selectedChoice
                                          ].happiness,
                                      stress: currentQuestion.choices[
                                          selectedChoice
                                      ].stress,
                                      tag: currentQuestion.choices[
                                          selectedChoice
                                      ].tag,
                                  },
                              ]
                            : []),
                    ],
                },
            };

            console.log(
                "[v0] Fetching new questions with previous Q&A:",
                finalResults.question_and_answer
            );

            const result = await fetchQuestions(
                token,
                finalResults.question_and_answer
            );

            if (!result.success || !result.data) {
                throw new Error(
                    result.error || "Failed to fetch new questions"
                );
            }

            console.log(
                "[v0] New questions fetched successfully:",
                result.data.length
            );

            // Append new questions to existing questions
            const allQuestions = [...questions, ...result.data];
            setQuestions(allQuestions);

            // Update userResults with new questions
            setUserResults((prev) => ({
                question_and_answer: {
                    questions: [
                        ...prev.question_and_answer.questions,
                        ...result.data!.map((q) => ({
                            question_id: q.question_id,
                            question_number: q.question_number,
                            category: q.category,
                            question: q.question,
                            choices: q.choices,
                            timeLimitSec: q.timeLimitSec,
                        })),
                    ],
                    answers: prev.question_and_answer.answers,
                },
            }));

            // Reset game state to continue from where we left off
            setIsComplete(false);
            setCurrentQuestionIndex(questions.length); // Start from first new question
            setSelectedChoice(null);
            setTimeLeft(result.data[0].timeLimitSec);
            setApiResults(null);
            setRoundNumber((prev) => prev + 1); // Increment round number

            console.log("[v0] Next round started successfully");
        } catch (error) {
            console.error("[v0] Failed to start next round:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to load next round";
            setResultsError(errorMessage);
        } finally {
            setIsLoadingQuestions(false);
        }
    };

    useEffect(() => {
        if (
            timeLeft > 0 &&
            selectedChoice === null &&
            !isComplete &&
            currentQuestion
        ) {
            const timer = setTimeout(
                () => setTimeLeft((prev) => prev - 1),
                1000
            );
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && selectedChoice === null) {
            handleSelect(null);
        }
    }, [timeLeft, selectedChoice, isComplete, handleSelect, currentQuestion]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (selectedChoice !== null || isComplete) return;

            if (e.key === "1") handleSelect(0);
            else if (e.key === "2") handleSelect(1);
            else if (e.key === "3") handleSelect(2);
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [selectedChoice, isComplete, handleSelect]);

    const shareResult = (platform: string) => {
        const stressPercentage = Math.min(
            100,
            Math.max(0, (totals.stress / 100) * 100)
        );
        const happinessPercentage = Math.min(
            100,
            Math.max(0, (totals.happiness / 100) * 100)
        );
        const cashPercentage = Math.min(
            100,
            Math.max(0, ((totals.cash - 15000) / 5000) * 100 + 50)
        );

        const shareText = `I just completed the Jaifoo personality quiz! My results: Stress ${Math.round(
            stressPercentage
        )}%, Happiness ${Math.round(happinessPercentage)}%, Cash ${Math.round(
            cashPercentage
        )}%`;
        const shareUrl = window.location.href;

        switch (platform) {
            case "line":
                window.open(
                    `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
                        shareUrl
                    )}&text=${encodeURIComponent(shareText)}`,
                    "_blank"
                );
                break;
            case "instagram":
                navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                alert(
                    "Result copied to clipboard! You can paste it in your Instagram story or post."
                );
                break;
            case "x":
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        shareText
                    )}&url=${encodeURIComponent(shareUrl)}`,
                    "_blank"
                );
                break;
            case "facebook":
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        shareUrl
                    )}&quote=${encodeURIComponent(shareText)}`,
                    "_blank"
                );
                break;
        }
    };

    if (showTokenDialog) {
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

                <main className="flex items-center justify-center px-6 py-8 min-h-[calc(100vh-120px)]">
                    <AlertDialog open={true}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Authentication Required
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    You need to complete the personalization
                                    process before taking the quiz. This helps
                                    us provide you with personalized questions
                                    and results.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={handleStayOnQuiz}>
                                    Stay Here
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleGoToPersonalization}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                                >
                                    Go to Personalization
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </main>
            </div>
        );
    }

    if (isLoadingQuestions || questions.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    {isLoadingQuestions ? (
                        <>
                            <div className="mb-6">
                                <div className="text-4xl font-bold text-yellow-400 mb-2">
                                    Round {roundNumber + 1}
                                </div>
                                <div className="text-lg text-gray-600">
                                    Get Ready!
                                </div>
                            </div>
                            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="mt-6 text-gray-600 font-medium">
                                Loading questions...
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                Preparing your personalized quiz
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <p className="text-gray-600 mb-4">
                                Failed to load questions from API
                            </p>
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                            >
                                Try Again
                            </Button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    if (isComplete) {
        if (resultsError && !isLoadingResults) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto px-6">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Failed to Load Results
                        </h2>
                        <p className="text-gray-600 mb-6">{resultsError}</p>
                        <div className="space-y-3">
                            <Button
                                onClick={retryFetchResults}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-full"
                            >
                                Try Loading Results Again
                            </Button>
                            <Button
                                onClick={() =>
                                    (window.location.href = "/personalization")
                                }
                                variant="outline"
                                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-full"
                            >
                                Go Back to Personalization
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        if (isLoadingResults) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            Analyzing your results...
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            This may take a few moments
                        </p>
                    </div>
                </div>
            );
        }

        const stressPercentage = apiResults
            ? apiResults.updatedParam.financialStressIndex || 0
            : Math.min(100, Math.max(0, (totals.stress / 100) * 100));
        const happinessPercentage = apiResults
            ? apiResults.updatedParam.happinessIndex || 0
            : Math.min(100, Math.max(0, (totals.happiness / 100) * 100));
        const cashPercentage = apiResults
            ? Math.min(
                  100,
                  Math.max(
                      0,
                      (((apiResults.updatedParam.cash || 15000) - 15000) /
                          5000) *
                          100 +
                          50
                  )
              )
            : Math.min(
                  100,
                  Math.max(0, ((totals.cash - 15000) / 5000) * 100 + 50)
              );

        const result: GameResultUI = {
            id: "api-result",
            title: apiResults?.epithetName || "",
            description: apiResults?.epithetDescription || "",
            imageUrl: apiResults?.image_file || "",
            themeColors: ["#6366f1", "#8b5cf6"], // indigo to purple gradient
            stats: {
                stressScore: Math.round(stressPercentage),
                happinessScore: Math.round(happinessPercentage),
                cash: Math.round(cashPercentage),
            },
        };

        return (
            <div className="min-h-screen bg-gray-50">
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
                            <h1 className="text-lg font-medium mb-4 text-center leading-relaxed">
                                "{result.title}"
                            </h1>

                            {/* Description */}
                            <p className="text-sm opacity-90 mb-6 leading-relaxed">
                                {result.description}
                            </p>

                            {apiResults && (
                                <div className="space-y-4 mb-6">
                                    {apiResults.keyinsight && (
                                        <div>
                                            <h3 className="text-sm font-semibold mb-2">
                                                Key Insight:
                                            </h3>
                                            <p className="text-sm opacity-90">
                                                {apiResults.keyinsight}
                                            </p>
                                        </div>
                                    )}
                                    {apiResults.strength && (
                                        <div>
                                            <h3 className="text-sm font-semibold mb-2">
                                                Strength:
                                            </h3>
                                            <p className="text-sm opacity-90">
                                                {apiResults.strength}
                                            </p>
                                        </div>
                                    )}
                                    {apiResults.areaOfImprovement && (
                                        <div>
                                            <h3 className="text-sm font-semibold mb-2">
                                                Area of Improvement:
                                            </h3>
                                            <p className="text-sm opacity-90">
                                                {apiResults.areaOfImprovement}
                                            </p>
                                        </div>
                                    )}
                                    {apiResults.suggestion && (
                                        <div>
                                            <h3 className="text-sm font-semibold mb-2">
                                                Suggestion:
                                            </h3>
                                            <p className="text-sm opacity-90">
                                                {apiResults.suggestion}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="space-y-3">
                                {/* Stress Score */}
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="w-full bg-white/20 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${result.stats.stressScore}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium w-10 text-right">
                                        {result.stats.stressScore}%
                                    </span>
                                </div>

                                {/* Happiness Score */}
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
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
                                                style={{
                                                    width: `${result.stats.happinessScore}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium w-10 text-right">
                                        {result.stats.happinessScore}%
                                    </span>
                                </div>

                                {/* Cash Score */}
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
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
                                                style={{
                                                    width: `${result.stats.cash}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium w-10 text-right">
                                        {result.stats.cash}%
                                    </span>
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
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629-.346 0-.626-.285-.626-.629V8.108c0-.345.282-.63.63-.63.348 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                </svg>
                            </button>

                            <button
                                onClick={() => shareResult("instagram")}
                                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center text-white transition-colors"
                                aria-label="Share on Instagram"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.668-.069 4.948.149 4.358 2.618 6.78 6.98 6.98 1.281.057 1.689.072 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.057-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-4-4-4s-4 1.791-4 4zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </button>

                            <button
                                onClick={() => shareResult("x")}
                                className="w-12 h-12 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition-colors"
                                aria-label="Share on X (Twitter)"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18.244 2.25h3.308L7.084 4.126H5.117z" />
                                </svg>
                            </button>

                            <button
                                onClick={() => shareResult("facebook")}
                                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors"
                                aria-label="Share on Facebook"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Bottom Text */}
                    <div className="text-center mt-6 mb-6">
                        <p className="text-gray-700 text-sm">
                            Next Round or Deep Talk with น้องใจฟู which feels
                            right, ค่ะ?
                        </p>
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
                            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleNextRound}
                            disabled={isLoadingQuestions || roundNumber >= 2}
                        >
                            {isLoadingQuestions ? "Loading..." : roundNumber >= 2 ? "Round Limit Reached" : "Next round"}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

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
                            onClick={() => handleSelect(index)}
                            disabled={selectedChoice !== null}
                            className={`w-full p-6 text-left rounded-xl border-2 transition-all ${
                                selectedChoice === index
                                    ? "bg-yellow-400 border-yellow-400 text-gray-900"
                                    : selectedChoice !== null
                                    ? "bg-gray-100 border-gray-200 text-gray-500"
                                    : "bg-white border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 text-gray-900"
                            }`}
                            variant="ghost"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-medium">
                                    {choice.label}
                                </span>
                                <span className="text-sm text-gray-500 ml-4">
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
