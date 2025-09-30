"use server"

import { z } from 'zod'
import axios, { AxiosError } from 'axios'

// Enhanced interfaces with validation schemas
const QuizChoiceSchema = z.object({
    cash: z.number(),
    happiness: z.number(),
    label: z.string(),
    stress: z.number(),
    tag: z.string(),
})

const QuizQuestionSchema = z.object({
    category: z.string(),
    choices: z.array(QuizChoiceSchema),
    question: z.string(),
    question_id: z.number(),
    question_number: z.number(),
    timeLimitSec: z.number(),
})

export interface QuizChoice extends z.infer<typeof QuizChoiceSchema> { }
export interface QuizQuestion extends z.infer<typeof QuizQuestionSchema> { }

// API response types
interface ApiSuccessResponse {
    code: number
    data: QuizQuestion[]
    debug?: {
        processingTime: string
        serverInstance: string
    }
    errors: null | string[]
    message: string
    requestId: string
    status: "success"
    success: true
    timestamp: string
    warnings: null | string[]
}

interface ApiErrorResponse {
    code: number
    data?: null
    errors: string[]
    message: string
    requestId: string
    status: "error" | "failed"
    success: false
    timestamp: string
    warnings?: string[]
    description?: string
    error?: string
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse

// Return type for the function
export interface FetchQuestionsResult {
    success: boolean
    data?: QuizQuestion[]
    error?: string
}

/**
 * Validates the API response data structure
 */
function validateQuestionsData(data: unknown): QuizQuestion[] {
    const questionsArray = Array.isArray(data) ? data : []
    return z.array(QuizQuestionSchema).parse(questionsArray)
}

/**
 * Fetches quiz questions from the API using Axios
 */
export async function fetchQuestions(token: string): Promise<FetchQuestionsResult> {
    if (!token?.trim()) {
        console.error('[fetchQuestions] No token provided')
        return {
            success: false,
            error: 'Authentication token is required'
        }
    }

    try {
        console.log('[fetchQuestions] Starting API request')
        console.log('[fetchQuestions] Token length:', token.trim().length)
        console.log('[fetchQuestions] Token preview:', token.trim().substring(0, 10) + '...')

        const requestBody = {
            question_and_answer: {
                questions: [],
                answers: [],
            },
        }

        const response = await axios.post<ApiResponse>(
            `${process.env.BACKEND_API_SERVER}/api/model/question/`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.trim()}`,
                    'Accept': 'application/json',
                },
                timeout: 300000,
            }
        )

        console.log('[fetchQuestions] Response status:', response.status)

        const apiResponse = response.data


        if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
            return {
                success: false,
                error: 'Invalid data structure received from API'
            }
        }

        const questionsData = validateQuestionsData(apiResponse.data)

        console.log('[fetchQuestions] Successfully fetched', questionsData.length, 'questions')

        return {
            success: true,
            data: questionsData
        }

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiErrorResponse>

            if (axiosError.code === 'ECONNABORTED') {
                return {
                    success: false,
                    error: 'Request timeout - please try again'
                }
            }

            if (axiosError.response) {
                const errorData = axiosError.response.data
                console.error('[fetchQuestions] Error response:', JSON.stringify(errorData, null, 2))

                const errorMsg = errorData?.description ||
                    errorData?.message ||
                    (errorData?.errors && errorData.errors.length > 0 ? errorData.errors.join(', ') : '') ||
                    `API request failed (${axiosError.response.status})`
                return {
                    success: false,
                    error: errorMsg
                }
            }

            return {
                success: false,
                error: `Network error: ${axiosError.message}`
            }
        }

        if (error instanceof Error) {
            return {
                success: false,
                error: `Request failed: ${error.message}`
            }
        }

        return {
            success: false,
            error: 'An unexpected error occurred'
        }
    }
}
