import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Check, MoreVertical } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto text-center">
                {/* Mascot */}
                <div className="mb-8">
                    <img
                        src="/../jaifoo_instruction_nobg.png"
                        alt="jaifoo_instruction_nobg"
                        className="w-auto h-40 object-contain"
                    />
                </div>

                {/* Instructional Text */}
                <div className="mb-12 space-y-4">
                    <h1 className="text-2xl font-bold text-gray-900 text-balance">
                        Imagine you're starting with 15,000 in cash 💰
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Let's play a quick "This or That" game to understand
                        your money style. We'll show you time-limited questions
                        to reveal your financial personality.
                    </p>
                </div>

                {/* Rules */}
                <div className="mb-12 space-y-4 w-full">
                    <div className="flex items-start gap-3 text-left">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-gray-700">
                            Each question lasts 5 seconds
                        </p>
                    </div>

                    <div className="flex items-start gap-3 text-left">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-gray-700">
                            You have 5 seconds to pick the most fitting option
                        </p>
                    </div>

                    <div className="flex items-start gap-3 text-left">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-gray-700">
                            <strong>Don't overthink it</strong>—go with your
                            first instinct
                        </p>
                    </div>
                </div>

                {/* Start Button */}
                <Link href="/personalization">
                    <Button
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 px-8 rounded-full text-lg transition-colors"
                        size="lg"
                    >
                        Start
                    </Button>
                </Link>
            </main>
        </div>
    );
}
