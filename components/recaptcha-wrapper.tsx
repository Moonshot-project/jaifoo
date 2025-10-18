"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ReactNode } from "react";

interface RecaptchaProviderProps {
    children: ReactNode;
}

/**
 * ReCAPTCHA v3 Provider Component
 * Wraps the application to provide reCAPTCHA v3 context
 * v3 runs automatically in the background and provides a score (0.0 - 1.0)
 */
export default function RecaptchaProvider({
    children,
}: RecaptchaProviderProps) {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!siteKey) {
        console.error(
            "NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set in environment variables",
        );
        return <>{children}</>;
    }

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={siteKey}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: "head",
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}
