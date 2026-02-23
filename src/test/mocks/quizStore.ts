import { vi } from 'vitest'
import type { Question, AnsweredQuestion } from '../../store/types'

export const sampleQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    correctAnswerId: '1',
    answers: [
      { id: '1', text: 'Paris' },
      { id: '2', text: 'London' },
      { id: '3', text: 'Berlin' },
    ],
  },
  {
    id: '2',
    question: 'What is the currency of Mauritius?',
    correctAnswerId: '2',
    answers: [
      { id: '1', text: 'USD' },
      { id: '2', text: 'Rs' },
      { id: '3', text: 'EUR' },
    ],
  },
]

export interface MockQuizStoreOverrides {
  questions?: Question[]
  currentQuestionId?: string | null
  answeredQuestions?: AnsweredQuestion[]
  isComplete?: boolean
  numCorrectAnswers?: number
  error?: string | null
  setQuestions?: ReturnType<typeof vi.fn>
  setError?: ReturnType<typeof vi.fn>
  setCurrentQuestion?: ReturnType<typeof vi.fn>
  submitAnswer?: ReturnType<typeof vi.fn>
  completeQuiz?: ReturnType<typeof vi.fn>
  resetQuiz?: ReturnType<typeof vi.fn>
}

export function createMockQuizStore(overrides: MockQuizStoreOverrides = {}) {
  const {
    questions = sampleQuestions,
    currentQuestionId = '1',
    answeredQuestions = [],
    isComplete = false,
    numCorrectAnswers = 0,
    error = null,
    setQuestions = vi.fn(),
    setError = vi.fn(),
    setCurrentQuestion = vi.fn(),
    submitAnswer = vi.fn(),
    completeQuiz = vi.fn(),
    resetQuiz = vi.fn(),
  } = overrides

  return {
    questions,
    currentQuestionId,
    answeredQuestions,
    isComplete,
    numCorrectAnswers,
    error,
    setQuestions,
    setError,
    setCurrentQuestion,
    submitAnswer,
    completeQuiz,
    resetQuiz,
  }
}

export const mockUseQuizStore = vi.fn()
