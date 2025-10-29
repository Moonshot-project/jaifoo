"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchQuestions } from "@/app/actions/questions";
import { fetchResults as fetchResultsFromServer } from "@/app/actions/results";
import AuthenticationDialog from "@/features/quiz/AuthenticationDialog";
import LoadingPage from "@/features/quiz/LoadingPage";
import QuizResultsPage from "@/features/quiz/QuizResultsPage";
import ActiveQuizPage from "@/features/quiz/ActiveQuizPage";
import PersonalityGameWrapper from "@/features/quiz/PersonalityGameWrapper";
import {
    QuizQuestion,
    UserQuizResults,
    ApiResultResponse,
} from "@/features/quiz/types";

export default function QuizPage() {
    // Core quiz states
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(5);
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

    // Question stages and data
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

    // Missing auth key dialog state
    const [showTokenDialog, setShowTokenDialog] = useState(false);

    // Results loading and error states
    const [apiResults, setApiResults] = useState<
        ApiResultResponse["data"] | null
    >(null);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [resultsError, setResultsError] = useState<string | null>(null);
    const [roundNumber, setRoundNumber] = useState(0);

    // Personality game flow state
    const [hasCompletedPersonalityGame, setHasCompletedPersonalityGame] =
        useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const hasFetchedRef = useRef(false);

    const getErrorMessage = (error: unknown): string => {
        return error instanceof Error
            ? error.message
            : "Unknown error occurred";
    };

    // Effect to fetch questions on mount
    useEffect(() => {
        const loadQuestions = async () => {
            if (hasFetchedRef.current) return;
            hasFetchedRef.current = true;

            try {
                setIsLoadingQuestions(true);

                const token = localStorage.getItem("jaifoo_jwt_token");
                if (!token) {
                    setShowTokenDialog(true);
                    setIsLoadingQuestions(false);
                    return;
                }

                const result = await fetchQuestions(token);
                if (!result.success || !result.data) {
                    throw new Error(
                        result.error || "Failed to fetch questions"
                    );
                }

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

                setIsLoadingQuestions(false);
            } catch (error) {
                console.error("Failed to load questions:", error);
                if (
                    error instanceof Error &&
                    error.message.includes("authentication")
                ) {
                    localStorage.removeItem("jaifoo_jwt_token");
                    setShowTokenDialog(true);
                }
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

    const handlePersonalityGameComplete = () => {
        setHasCompletedPersonalityGame(true);
    };

    const prepareFinalResults = useCallback(() => {
        return {
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
                                  label: currentQuestion.choices[selectedChoice]
                                      .label,
                                  cash: currentQuestion.choices[selectedChoice]
                                      .cash,
                                  happiness:
                                      currentQuestion.choices[selectedChoice]
                                          .happiness,
                                  stress: currentQuestion.choices[
                                      selectedChoice
                                  ].stress,
                                  tag: currentQuestion.choices[selectedChoice]
                                      .tag,
                              },
                          ]
                        : []),
                ],
            },
        };
    }, [userResults, selectedChoice, currentQuestion]);

    const handleSelect = useCallback(
        (choiceIndex: number | null) => {
            if (selectedChoice !== null) return;

            setSelectedChoice(choiceIndex);

            const choice =
                choiceIndex !== null
                    ? currentQuestion.choices[choiceIndex]
                    : null;

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

            setTimeout(() => {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex((prev) => prev + 1);
                    const nextQuestion = questions[currentQuestionIndex + 1];
                    setTimeLeft(nextQuestion.timeLimitSec);
                    setSelectedChoice(null);
                } else {
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

    const fetchResults = useCallback(async () => {
        try {
            setIsLoadingResults(true);
            setResultsError(null);

            const token = localStorage.getItem("jaifoo_jwt_token");

            if (!token) {
                throw new Error("No authentication token found");
            }

            const finalResults = prepareFinalResults();
            const result = await fetchResultsFromServer(
                token,
                finalResults.question_and_answer
            );

            if (result.success && result.data && result.data.data) {
                setApiResults(result.data.data);
                setResultsError(null);
            } else {
                console.error("Results fetch failed:", result.error);
                setResultsError(
                    result.error || "Failed to fetch results from server"
                );
            }
        } catch (error) {
            console.error("Results fetch error:", error);
            setResultsError(getErrorMessage(error));
        } finally {
            setIsLoadingResults(false);
        }
    }, [prepareFinalResults, getErrorMessage]);

    const retryFetchResults = () => {
        fetchResults();
    };

    const handleNextRound = useCallback(async () => {
        try {
            setRoundNumber((prev) => prev + 1);
            setHasCompletedPersonalityGame(false);
            setIsLoadingQuestions(true);
            setResultsError(null);

            const token = localStorage.getItem("jaifoo_jwt_token");

            if (!token) {
                setShowTokenDialog(true);
                setIsLoadingQuestions(false);
                return;
            }

            const finalResults = prepareFinalResults();
            const result = await fetchQuestions(
                token,
                finalResults.question_and_answer
            );

            if (!result.success || !result.data) {
                throw new Error(
                    result.error || "Failed to fetch new questions"
                );
            }

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
            setApiResults(null);
        } catch (error) {
            console.error("Failed to start next round:", error);
            setResultsError(getErrorMessage(error));
        } finally {
            setIsLoadingQuestions(false);
        }
    }, [prepareFinalResults, questions, getErrorMessage]);

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

    useEffect(() => {
        if (
            hasCompletedPersonalityGame &&
            !isLoadingQuestions &&
            questions.length > 0
        ) {
            setTimeLeft(questions[0].timeLimitSec);
        }
    }, [hasCompletedPersonalityGame, isLoadingQuestions, questions]);

    useEffect(() => {
        console.log("User Results Updated:", userResults);
    }, [userResults]);

    // Render Authentication Dialog
    if (showTokenDialog) {
        return (
            <AuthenticationDialog
                onGoToPersonalization={handleGoToPersonalization}
                onStayOnQuiz={handleStayOnQuiz}
            />
        );
    }

    // Render Personality Game (first thing user sees)
    if (!hasCompletedPersonalityGame) {
        return (
            <PersonalityGameWrapper
                roundNumber={roundNumber}
                onComplete={handlePersonalityGameComplete}
            />
        );
    }

    // Render Loading Page (after personality game is complete)
    if (isLoadingQuestions && hasCompletedPersonalityGame) {
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
