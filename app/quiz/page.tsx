"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchQuestions } from "@/app/actions/questions";
import { fetchResults as fetchResultsFromServer } from "@/app/actions/results";
import AuthenticationDialog from "@/features/quiz/AuthenticationDialog";
import LoadingPage from "@/features/quiz/LoadingPage";
import QuizResultsPage from "@/features/quiz/QuizResultsPage";
import ActiveQuizPage from "@/features/quiz/ActiveQuizPage";
import {
    QuizQuestion,
    QuizAnswer,
    UserQuizResults,
    ApiResultResponse,
} from "@/features/quiz/types";

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
    const [showTokenDialog, setShowTokenDialog] = useState(false);
    const [apiResults, setApiResults] = useState<
        ApiResultResponse["data"] | null
    >(null);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [resultsError, setResultsError] = useState<string | null>(null);
    const [roundNumber, setRoundNumber] = useState(0);

    const currentQuestion = questions[currentQuestionIndex];
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        const loadQuestions = async () => {
            if (hasFetchedRef.current) return;
            hasFetchedRef.current = true;

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
                            choices: q.choices,
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
            setResultsError(null);

            const token = localStorage.getItem("jaifoo_jwt_token");

            if (!token) {
                throw new Error("No authentication token found");
            }

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

            const allQuestions = [...questions, ...result.data];
            setQuestions(allQuestions);

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

            setIsComplete(false);
            setCurrentQuestionIndex(questions.length);
            setSelectedChoice(null);
            setTimeLeft(result.data[0].timeLimitSec);
            setApiResults(null);
            setRoundNumber((prev) => prev + 1);

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

    // Render Authentication Dialog
    if (showTokenDialog) {
        return (
            <AuthenticationDialog
                onGoToPersonalization={handleGoToPersonalization}
                onStayOnQuiz={handleStayOnQuiz}
            />
        );
    }

    // Render Loading Page
    if (isLoadingQuestions || questions.length === 0) {
        return (
            <LoadingPage
                isLoadingQuestions={isLoadingQuestions}
                roundNumber={roundNumber}
                onRetry={() => window.location.reload()}
            />
        );
    }

    // Render Results Page
    if (isComplete) {
        return (
            <QuizResultsPage
                resultsError={resultsError}
                isLoadingResults={isLoadingResults}
                apiResults={apiResults}
                totals={totals}
                roundNumber={roundNumber}
                isLoadingQuestions={isLoadingQuestions}
                onRetry={retryFetchResults}
                onNextRound={handleNextRound}
                onShare={shareResult}
            />
        );
    }

    // Render Active Quiz Page
    return (
        <ActiveQuizPage
            currentQuestion={currentQuestion}
            timeLeft={timeLeft}
            selectedChoice={selectedChoice}
            onSelect={handleSelect}
        />
    );
}
