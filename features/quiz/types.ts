export interface QuizChoice {
    cash: number;
    happiness: number;
    label: string;
    stress: number;
    tag: string;
}

export interface QuizQuestion {
    category: string;
    choices: QuizChoice[];
    question: string;
    question_id: number;
    question_number: number;
    timeLimitSec: number;
}

export interface QuizAnswer {
    questionId: number;
    choiceIndex: number | null; // null if timeout
    timeSpentSec: number;
    isTimeout: boolean;
    selectedChoice?: QuizChoice;
}

export interface UserQuizResults {
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

export interface GameResultUI {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    themeColors: [string, string];
    stats: {
        stressScore: number;
        happinessScore: number;
        cash: number;
    };
}

export interface ApiResultResponse {
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
    } | null;
    success: boolean;
    message: string;
    error?: string;
}

export interface PersonalityBubble {
    id: string;
    emoji: string;
    label: string;
    size: "small" | "medium" | "large";
    position: {
        x: number;
        y: number;
    };
    category: string;
}

export interface PersonalityMiniGameProps {
    title: string;
    subtitle: string;
    maxSelections: number;
    bubbles: PersonalityBubble[];
    onComplete: (selectedIds: string[]) => void;
}
