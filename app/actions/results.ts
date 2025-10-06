"use server";

import axios, { AxiosError } from "axios";

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
    };
    debug: {
        processingTime: string;
        serverInstance: string;
    };
    errors: null | string[];
    message: string;
    requestId: string;
    status: string;
    success: boolean;
    timestamp: string;
    warnings: null | string[];
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

/**
 * Sanitizes token for logging (shows first 8 chars + length)
 */
function sanitizeTokenForLogging(token: string): string {
    return `${token.substring(0, 8)}... (${token.length} chars)`;
}

export async function fetchResults(
    token: string,
    questionAndAnswer: UserQuizResults["question_and_answer"]
): Promise<{ success: boolean; data?: ApiResultResponse; error?: string }> {
    const startTime = Date.now();

    try {
        if (!token?.trim()) {
            console.warn("fetchResults: No authentication token provided");
            return {
                success: false,
                error: "No authentication token provided",
            };
        }

        var requestBody = {
            question_and_answer: questionAndAnswer,
        };

        console.log("[v0] Server: Token info:", sanitizeTokenForLogging(token));
        console.log(
            "DEBUG: Fetching use persona with request body:",
            requestBody
        );

        const response = await axios.post<ApiResultResponse>(
            `${process.env.BACKEND_API_SERVER}/api/model/interpret-result/`,
            requestBody,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.trim()}`,
                    Accept: "application/json",
                },
                timeout: parseInt(process.env.MAXIMUM_API_TIMEOUT || "30000"),
            }
        );

        const requestDuration = Date.now() - startTime;
        console.log(
            `[v0] Server: Response received after ${requestDuration}ms, status: ${response.status}`
        );
        console.log("response", response);

        const data = response.data;

        console.log("[v0] Server: Results API response:", data);
        console.log("[v0] Server: API response metadata:", {
            code: data.code,
            success: data.success,
            status: data.status,
            hasData: !!data.data,
            requestDuration: requestDuration,
            requestId: data.requestId,
            processingTime: data.debug?.processingTime,
        });

        if (data.code !== 200 || !data.success || data.status !== "success") {
            const errorMsg =
                data.message ||
                (data.errors && data.errors.length > 0
                    ? data.errors.join(", ")
                    : "") ||
                "Invalid API response format";
            console.error("[v0] Server: API returned error:", {
                code: data.code,
                success: data.success,
                status: data.status,
                message: data.message,
                errors: data.errors,
                duration: requestDuration,
            });
            return {
                success: false,
                error: errorMsg,
            };
        }

        // Check if data exists (it can be null/empty for valid responses)
        if (!data.data) {
            console.warn("[v0] Server: API response has no data object:", {
                code: data.code,
                success: data.success,
                status: data.status,
                message: data.message,
            });
        }

        console.log(
            `[v0] Server: Successfully fetched results in ${requestDuration}ms`
        );
        console.log("[v0] Server: Request completed:", {
            requestId: data.requestId,
            processingTime: data.debug?.processingTime,
            timestamp: data.timestamp,
            totalDuration: requestDuration,
        });

        return { success: true, data };
    } catch (error) {
        const requestDuration = Date.now() - startTime;

        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiResultResponse>;

            if (axiosError.code === "ECONNABORTED") {
                console.error(
                    `[v0] Server: Request timeout after ${requestDuration}ms`
                );
                return {
                    success: false,
                    error: "Request timed out - please try again",
                };
            }

            if (axiosError.response) {
                const errorData = axiosError.response.data;
                console.error("[v0] Server: API request failed:", {
                    status: axiosError.response.status,
                    statusText: axiosError.response.statusText,
                    data: errorData,
                    duration: requestDuration,
                });

                const errorMsg =
                    errorData?.message ||
                    (errorData?.errors && errorData.errors.length > 0
                        ? errorData.errors.join(", ")
                        : "") ||
                    `API request failed (${axiosError.response.status})`;

                return {
                    success: false,
                    error: errorMsg,
                };
            }

            console.error("[v0] Server: Network error:", {
                message: axiosError.message,
                code: axiosError.code,
                duration: requestDuration,
            });

            return {
                success: false,
                error: `Network error: ${axiosError.message}`,
            };
        }

        if (error instanceof Error) {
            console.error("[v0] Server: Request failed:", {
                name: error.name,
                message: error.message,
                stack: error.stack,
                duration: requestDuration,
            });

            return {
                success: false,
                error: `Request failed: ${error.message}`,
            };
        }

        console.error("[v0] Server: Failed to fetch results from API:", error);
        return {
            success: false,
            error: "An unexpected error occurred",
        };
    }
}
