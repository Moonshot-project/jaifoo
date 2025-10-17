"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { authenticateUser } from "@/app/actions/auth";
import RecaptchaWrapper from "@/components/recaptcha-wrapper";
import type ReCAPTCHA from "react-google-recaptcha";

export default function PersonalizationPage() {
    const [name, setName] = useState("");
    const [feelGoodValue, setFeelGoodValue] = useState([50]);
    const [tightnessValue, setTightnessValue] = useState([50]);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [showRecaptchaModal, setShowRecaptchaModal] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const handleReadyClick = () => {
        if (!name.trim()) {
            setLoginError("Please enter your name first");
            return;
        }

        setLoginError("");
        setShowRecaptchaModal(true);
    };


    const handleRecaptchaChange = (token: string | null) => {
        setRecaptchaToken(token);
        if (token) {
            setLoginError("");
            // Automatically proceed with login after reCAPTCHA is verified
            proceedWithLogin(token);
        }
    };

    const proceedWithLogin = async (token: string) => {
        setIsLoggingIn(true);
        setLoginError("");

        try {
            const payload = {
                user_name: name.trim(),
                stress_score: Array.isArray(tightnessValue)
                    ? tightnessValue[0]
                    : tightnessValue,
                happiness_score: Array.isArray(feelGoodValue)
                    ? feelGoodValue[0]
                    : feelGoodValue,
                recaptcha_token: token,
            };

            const result = await authenticateUser(payload);

            if (!result.success) {
                throw new Error(result.error || "Authentication failed");
            }

            const { data } = result;

            localStorage.setItem("jaifoo_jwt_token", data!.access_token);
            localStorage.setItem(
                "jaifoo_user_data",
                JSON.stringify({
                    name: data!.user_name,
                    user_id: data!.user_id,
                    tightnessValue: data!.stress_score,
                    feelGoodValue: data!.happiness_score,
                })
            );

            // Navigate
            window.location.href = "/quiz";
        } catch (err: any) {
            setLoginError(
                err instanceof Error ? err.message : "Authentication failed"
            );
            console.error("Authentication error:", err);
            // Reset reCAPTCHA on error
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
                setRecaptchaToken(null);
            }
            setShowRecaptchaModal(false);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleRecaptchaExpired = () => {
        setRecaptchaToken(null);
        setLoginError("reCAPTCHA expired. Please verify again.");
    };

    const handleRecaptchaError = () => {
        setRecaptchaToken(null);
        setLoginError("reCAPTCHA error. Please try again.");
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
            <main className="flex flex-col items-center justify-center px-6 py-8 max-w-md mx-auto">
                {/* Intro Text */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 text-balance mb-2">
                        น้องใจฟู is all set—are you?
                    </h1>
                    <p className="text-gray-600 text-lg">
                        We'll spend just 2 minutes together.
                    </p>
                </div>

                {/* Name Input */}
                <div className="w-full mb-8">
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                        What should Jaifoo call you?
                    </label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-0"
                    />
                </div>

                {/* Feel-good Meter */}
                <div className="w-full mb-8">
                    <label className="block text-lg font-medium text-gray-900 mb-2">
                        Feel-good meter
                    </label>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        From how your money choices make you smile right
                        now—little stress, comfort, or wins that feel like YOU.
                        Not a moral score, just your mood meter.
                    </p>
                    <div className="px-2">
                        <Slider
                            value={feelGoodValue}
                            onValueChange={setFeelGoodValue}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Low</span>
                            <span>High</span>
                        </div>
                    </div>
                </div>

                {/* Tightness Meter */}
                <div className="w-full mb-8">
                    <label className="block text-lg font-medium text-gray-900 mb-2">
                        Tightness meter
                    </label>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        Your money muscles—worries about bills, debt, or not
                        having a cushion. How heavy or light it feels today.
                    </p>
                    <div className="px-2">
                        <Slider
                            value={tightnessValue}
                            onValueChange={setTightnessValue}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Light</span>
                            <span>Heavy</span>
                        </div>
                    </div>
                </div>

                {/* Closing Guidance */}
                <div className="mb-8 text-center">
                    <p className="text-gray-600 text-lg">
                        No pressure, just go with your first instinct, นะคะ ✨
                    </p>
                </div>

                {loginError && (
                    <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{loginError}</p>
                    </div>
                )}

                <Button
                    onClick={handleReadyClick}
                    disabled={isLoggingIn}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 px-8 rounded-full text-lg transition-colors disabled:opacity-50"
                    size="lg"
                >
                    {isLoggingIn ? "Getting ready..." : "Ready, let's go"}
                </Button>
            </main>

            {/* reCAPTCHA Modal */}
            <Dialog open={showRecaptchaModal} onOpenChange={setShowRecaptchaModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl">Verify you're human</DialogTitle>
                        <DialogDescription className="text-center">
                            Please complete the verification below to continue
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="rounded-xl overflow-hidden">
                            <RecaptchaWrapper
                                ref={recaptchaRef}
                                onChange={handleRecaptchaChange}
                                onExpired={handleRecaptchaExpired}
                                onErrored={handleRecaptchaError}
                            />
                        </div>
                        {isLoggingIn && (
                            <div className="mt-6 text-center">
                                <p className="text-gray-600">Verifying and logging in...</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
