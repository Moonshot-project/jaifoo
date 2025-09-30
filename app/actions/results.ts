"use server"

interface ApiResultResponse {
    code: number
    data: {
        areaOfImprovement: string
        epithetDescription: string
        epithetName: string
        image_file: string
        keyinsight: string
        strength: string
        suggestion: string
        updatedParam: {
            cash: number | null
            financialStressIndex: number | null
            happinessIndex: number | null
        }
    }
    debug: {
        processingTime: string
        serverInstance: string
    }
    errors: null | string[]
    message: string
    requestId: string
    status: string
    success: boolean
    timestamp: string
    warnings: null | string[]
}

interface UserQuizResults {
    question_and_answer: {
        questions: Array<{
            question_id: number
            question_number: number
            category: string
            question: string
            choices: {
                label: string
                cash: number
                happiness: number
                stress: number
                tag: string
            }
            timeLimitSec: number
        }>
        answers: Array<{
            question_id: number
            question_number: number
            label: string
            cash: number
            happiness: number
            stress: number
            tag: string
        }>
    }
}

/**
 * Creates AbortController with 5-minute timeout
 */
function createTimeoutController(timeoutMs = 300000): AbortController {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), timeoutMs)
    return controller
}

/**
 * Sanitizes token for logging (shows first 8 chars + length)
 */
function sanitizeTokenForLogging(token: string): string {
    return `${token.substring(0, 8)}... (${token.length} chars)`
}

export async function fetchResults(
    token: string,
    questionAndAnswer: UserQuizResults["question_and_answer"],
): Promise<{ success: boolean; data?: ApiResultResponse; error?: string }> {
    const controller = createTimeoutController()
    const startTime = Date.now()

    try {
        if (!token) {
            console.warn("fetchResults: No authentication token provided")
            return { success: false, error: "No authentication token provided" }
        }

        console.log("[v0] Server: Starting results fetch with 5-minute timeout")
        console.log("[v0] Server: Token info:", sanitizeTokenForLogging(token))
        console.log("[v0] Server: Fetching results from API with data:", questionAndAnswer)

        const response = await fetch(`${process.env.BACKEND_API_SERVER}api/model/interpret-result/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            body: JSON.stringify({
                question_and_answer: questionAndAnswer,
            }),
            signal: controller.signal,
        })

        const requestDuration = Date.now() - startTime
        console.log(`[v0] Server: Response received after ${requestDuration}ms, status: ${response.status}`)
        console.log("response", response)

        if (!response.ok) {
            let errorMessage: string
            let errorResponseText = ""

            try {
                errorResponseText = await response.text()
                console.log("[v0] Server: Error response text:", errorResponseText)
                errorMessage = errorResponseText || `HTTP ${response.status}: ${response.statusText}`
            } catch {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`
            }

            console.error("[v0] Server: API request failed:", {
                status: response.status,
                statusText: response.statusText,
                error: errorMessage,
                duration: requestDuration,
            })

            return {
                success: false,
                error: `API request failed (${response.status}): ${errorMessage}`,
            }
        }

        // Get and parse response
        let responseText: string
        try {
            responseText = await response.text()
            console.log("[v0] Server: Response text length:", responseText.length)
        } catch (textError) {
            console.error("[v0] Server: Failed to read response text:", textError)
            return {
                success: false,
                error: "Failed to read response from server",
            }
        }

        let data: ApiResultResponse
        try {
            data = JSON.parse(responseText)
            console.log("[v0] Server: Successfully parsed JSON response")
        } catch (parseError) {
            console.error("[v0] Server: JSON parse error:", parseError)
            console.error(
                "[v0] Server: Failed to parse response text:",
                responseText.substring(0, 500) + (responseText.length > 500 ? "..." : ""),
            )
            return {
                success: false,
                error: "Invalid JSON response from server",
            }
        }

        console.log("[v0] Server: Results API response:", data)
        console.log("[v0] Server: API response metadata:", {
            code: data.code,
            success: data.success,
            status: data.status,
            hasData: !!data.data,
            requestDuration: requestDuration,
            requestId: data.requestId,
            processingTime: data.debug?.processingTime,
        })

        if (data.code !== 200 || !data.success || data.status !== "success") {
            const errorMsg =
                data.message ||
                (data.errors && data.errors.length > 0 ? data.errors.join(", ") : "") ||
                "Invalid API response format"
            console.error("[v0] Server: API returned error:", {
                code: data.code,
                success: data.success,
                status: data.status,
                message: data.message,
                errors: data.errors,
                duration: requestDuration,
            })
            return {
                success: false,
                error: errorMsg,
            }
        }

        // Check if data exists (it can be null/empty for valid responses)
        if (!data.data) {
            console.warn("[v0] Server: API response has no data object:", {
                code: data.code,
                success: data.success,
                status: data.status,
                message: data.message,
            })
        }

        console.log(`[v0] Server: Successfully fetched results in ${requestDuration}ms`)
        console.log("[v0] Server: Request completed:", {
            requestId: data.requestId,
            processingTime: data.debug?.processingTime,
            timestamp: data.timestamp,
            totalDuration: requestDuration,
        })

        return { success: true, data }
    } catch (error) {
        const requestDuration = Date.now() - startTime

        if (error instanceof Error) {
            if (error.name === "AbortError") {
                console.error(`[v0] Server: Request timeout after ${requestDuration}ms (5 minutes)`)
                return {
                    success: false,
                    error: "Request timed out after 5 minutes - please try again",
                }
            }

            console.error("[v0] Server: Request failed:", {
                name: error.name,
                message: error.message,
                stack: error.stack,
                duration: requestDuration,
            })

            return {
                success: false,
                error: `Network error: ${error.message}`,
            }
        }

        console.error("[v0] Server: Failed to fetch results from API:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        }
    }
}
