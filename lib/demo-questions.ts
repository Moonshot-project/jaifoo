export interface QuizOption {
  id: string // stable id, e.g. "A" | "B" | "C"
  label: string // text shown on the card
  stressScore: number // stress adjustment if picked
  happinessScore: number // happiness adjustment if picked
  cash: number // cash impact (positive or negative)
}

export interface QuizQuestion {
  id: string // unique
  text: string // the question shown at the top
  options: [QuizOption, QuizOption, QuizOption] // exactly 3 options
  timeLimitSec: number // per-question timer (e.g., 5)
  nextId?: string | null // optional explicit next; otherwise go by index order
}

export interface QuizConfig {
  startQuestionId?: string // optional; if omitted use first element
  shuffleQuestions?: boolean // default false
  shuffleOptions?: boolean // default false
  autoAdvanceDelayMs?: number // delay before moving to next after select/timeout (default 300ms)
}

export interface QuizAnswer {
  questionId: string
  optionId: string | null // null if timeout
  timeSpentSec: number
  isTimeout: boolean
}

export const demoQuestions: QuizQuestion[] = [
  {
    id: "q1",
    text: "Pick the vibe that feels most you—right now.",
    timeLimitSec: 5,
    options: [
      { id: "A", label: "Calm & steady", stressScore: -1, happinessScore: 3, cash: 0 },
      { id: "B", label: "Curious & exploratory", stressScore: 0, happinessScore: 2, cash: -100 },
      { id: "C", label: "Fast & focused", stressScore: 2, happinessScore: 1, cash: 50 },
    ],
    nextId: "q2",
  },
  {
    id: "q2",
    text: "If money was weather today, it would be…",
    timeLimitSec: 5,
    options: [
      { id: "A", label: "Clear skies", stressScore: -2, happinessScore: 3, cash: 0 },
      { id: "B", label: "Cloudy but bright", stressScore: 0, happinessScore: 2, cash: -50 },
      { id: "C", label: "Stormy, but passing", stressScore: 2, happinessScore: -1, cash: -200 },
    ],
  },
]

export interface APIQuestionChoice {
  label: string
  cash: number
  happiness: number
  stress: number
  tag: string
}

export interface APIQuestion {
  question_id: number
  question_number: number
  category: string
  question: string
  choices: APIQuestionChoice[]
  timeLimitSec: number
}

export interface APIQuestionRequest {
  question_and_answer: {
    questions: Array<{
      question_id: number
      question_number: number
      category: string
      question: string
      choices: APIQuestionChoice
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

export interface APIQuestionResponse {
  code: number
  data: {
    message: APIQuestion[]
  }
  success: boolean
  message: string
}

export function convertAPIQuestionToQuizQuestion(apiQuestion: APIQuestion): QuizQuestion {
  return {
    id: `q${apiQuestion.question_id}`,
    text: apiQuestion.question,
    timeLimitSec: apiQuestion.timeLimitSec || 5,
    options: [
      {
        id: "A",
        label: apiQuestion.choices[0]?.label || "Option A",
        stressScore: apiQuestion.choices[0]?.stress || 0,
        happinessScore: apiQuestion.choices[0]?.happiness || 0,
        cash: apiQuestion.choices[0]?.cash || 0,
      },
      {
        id: "B",
        label: apiQuestion.choices[1]?.label || "Option B",
        stressScore: apiQuestion.choices[1]?.stress || 0,
        happinessScore: apiQuestion.choices[1]?.happiness || 0,
        cash: apiQuestion.choices[1]?.cash || 0,
      },
      {
        id: "C",
        label: apiQuestion.choices[2]?.label || "Option C",
        stressScore: apiQuestion.choices[2]?.stress || 0,
        happinessScore: apiQuestion.choices[2]?.happiness || 0,
        cash: apiQuestion.choices[2]?.cash || 0,
      },
    ],
  }
}

export async function fetchAIQuestions(
  previousQuestions: QuizQuestion[] = [],
  previousAnswers: QuizAnswer[] = [],
): Promise<QuizQuestion[]> {
  try {
    const token = localStorage.getItem("jaifoo_jwt_token")
    if (!token) {
      console.warn("No JWT token found, falling back to demo questions")
      return demoQuestions
    }

    // Convert previous questions and answers to API format
    const apiQuestions = previousQuestions.map((q, index) => {
      const answer = previousAnswers.find((a) => a.questionId === q.id)
      const selectedOption = answer ? q.options.find((opt) => opt.id === answer.optionId) : q.options[0]

      return {
        question_id: index + 1,
        question_number: index + 1,
        category: "ใช้จ่าย", // Default category, could be made dynamic
        question: q.text,
        choices: selectedOption || q.options[0],
        timeLimitSec: q.timeLimitSec,
      }
    })

    const apiAnswers = previousAnswers.map((answer, index) => {
      const question = previousQuestions.find((q) => q.questionId === answer.questionId)
      const selectedOption = question?.options.find((opt) => opt.id === answer.optionId)

      return {
        question_id: index + 1,
        question_number: index + 1,
        label: selectedOption?.label || "",
        cash: selectedOption?.cash || 0,
        happiness: selectedOption?.happinessScore || 0,
        stress: selectedOption?.stressScore || 0,
        tag: "Impulse", // Default tag, could be made dynamic based on option
      }
    })

    const requestBody: APIQuestionRequest = {
      question_and_answer: {
        questions: apiQuestions,
        answers: apiAnswers,
      },
    }

    const response = await fetch("/api/ai/question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data: APIQuestionResponse = await response.json()

    if (!data.success || !data.data.message) {
      throw new Error("Invalid API response format")
    }

    // Convert API questions to internal format
    return data.data.message.map(convertAPIQuestionToQuizQuestion)
  } catch (error) {
    console.error("Failed to fetch AI questions:", error)
    // Fallback to demo questions if API fails
    return demoQuestions
  }
}
