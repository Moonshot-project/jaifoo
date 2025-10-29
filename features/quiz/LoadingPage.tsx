import { Button } from "@/components/ui/button";

interface LoadingPageProps {
    isLoadingQuestions: boolean;
    roundNumber: number;
    onRetry?: () => void;
}

export default function LoadingPage({
    isLoadingQuestions,
    roundNumber,
    onRetry,
}: LoadingPageProps) {
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
                        {onRetry && (
                            <Button
                                onClick={onRetry}
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                            >
                                Try Again
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
