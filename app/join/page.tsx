"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { authenticateWithLine, getLineAuthUrl } from "@/app/actions/lineAuth";
import { useRouter, useSearchParams } from "next/navigation";

function JoinPageContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Handle LINE OAuth callback
    useEffect(() => {
        const code = searchParams.get("code");

        if (code) {
            handleLineCallback(code);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const handleLineCallback = async (code: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await authenticateWithLine(code);

            if (result.success && result.data) {
                // Store authentication data in localStorage or session
                localStorage.setItem("auth_token", result.data.access_token);
                localStorage.setItem("user_id", result.data.user_id);
                localStorage.setItem("user_email", result.data.email);

                // Redirect to quiz or dashboard
                router.push("/quiz");
            } else {
                setError(
                    result.error || "LINE authentication failed. Please try again.",
                );
                // Clear URL parameters on error
                router.replace("/join");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            router.replace("/join");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialAuth = async (provider: string) => {
        if (provider === "LINE") {
            setIsLoading(true);
            setError(null);

            try {
                const result = await getLineAuthUrl();

                if (result.success && result.url) {
                    // Redirect to LINE OAuth
                    window.location.href = result.url;
                } else {
                    setError(
                        result.error ||
                            "Failed to initialize LINE login. Please try again.",
                    );
                    setIsLoading(false);
                }
            } catch (err) {
                setError("An unexpected error occurred. Please try again.");
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#ffc92b] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">
                        ใจฟูพร้อมคุยกับคุณเสมอ ไม่มีค่าใช้จ่าย
                    </h1>
                    <p className="text-gray-700 text-lg">
                        เป็นเพื่อนกับใจฟูด้วย LINE
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* LINE QR Code */}
                <div className="flex justify-center mb-8">
                    <Image
                        src="/images/jaifoo_line_qr.png"
                        alt="LINE QR Code"
                        width={200}
                        height={200}
                        className="rounded-lg shadow-md"
                    />
                </div>

                {/* Social Auth Buttons */}
                <div className="mb-8">
                    <Button
                        onClick={() => handleSocialAuth("LINE")}
                        disabled={isLoading}
                        className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white border-0 h-14 text-base font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            "Loading..."
                        ) : (
                            <>
                                <svg
                                    className="w-6 h-6 mr-3"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                >
                                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .626.285.626.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.345.282-.63.63-.63h2.386c.345 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                                </svg>
                                Continue with LINE
                            </>
                        )}
                    </Button>
                </div>

                {/* Divider */}
                {/* <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-gray-400" />
                    <span className="text-gray-700 text-sm font-medium">
                        OR
                    </span>
                    <div className="flex-1 h-px bg-gray-400" />
                </div> */}

                {/* Email Input */}
                {/* <div className="mb-6">
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tony.stark@example.com"
                        className="w-full h-14 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 rounded-xl text-base focus:border-gray-400 focus-visible:ring-0"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && email.trim()) {
                                handleContinue();
                            }
                        }}
                    />
                </div> */}

                {/* Continue Button */}
                {/* <Button
          onClick={handleContinue}
          disabled={!email.trim() || isLoading}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white h-14 text-base font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Please wait..." : "Continue"}
        </Button> */}

                {/* Footer */}
                <p className="text-center text-gray-700 text-sm mt-8">
                    By signing up, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="underline hover:text-gray-900 transition-colors font-medium"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="underline hover:text-gray-900 transition-colors font-medium"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}

export default function JoinPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#ffc92b] flex items-center justify-center">
                <div className="text-gray-900">Loading...</div>
            </div>
        }>
            <JoinPageContent />
        </Suspense>
    );
}
