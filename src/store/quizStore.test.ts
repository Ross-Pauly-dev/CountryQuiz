import { beforeEach, describe, expect, it } from 'vitest'
import { useQuizStore } from './quizStore'
import type { Question } from './types'

const sampleQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    correctAnswerId: '1',
    answers: [
      { id: '1', text: 'Paris' },
      { id: '2', text: 'London' },
    ],
  },
  {
    id: '2',
    question: 'What is the currency of Mauritius?',
    correctAnswerId: '2',
    answers: [
      { id: '1', text: 'USD' },
      { id: '2', text: 'Rs' },
    ],
  },
]

describe('quizStore', () => {
  beforeEach(() => {
    useQuizStore.getState().resetQuiz()
  })

  describe('setQuestions', () => {
    it('sets questions and currentQuestionId to first question', () => {
      useQuizStore.getState().setQuestions(sampleQuestions)
      const state = useQuizStore.getState()
      expect(state.questions).toEqual(sampleQuestions)
      expect(state.currentQuestionId).toBe('1')
      expect(state.error).toBeNull()
      expect(state.numCorrectAnswers).toBe(0)
      expect(state.isComplete).toBe(false)
    })

    it('sets error when questions array is empty', () => {
      useQuizStore.getState().setQuestions([])
      const state = useQuizStore.getState()
      expect(state.error).toBe('Questions must be an array')
      expect(state.questions).toEqual([])
    })
  })

  describe('setError', () => {
    it('updates error', () => {
      useQuizStore.getState().setError('Something went wrong')
      expect(useQuizStore.getState().error).toBe('Something went wrong')
    })

    it('clears error when passed null', () => {
      useQuizStore.getState().setError('Error')
      useQuizStore.getState().setError(null)
      expect(useQuizStore.getState().error).toBeNull()
    })
  })

  describe('setCurrentQuestion', () => {
    it('updates currentQuestionId when id exists in questions', () => {
      useQuizStore.getState().setQuestions(sampleQuestions)
      useQuizStore.getState().setCurrentQuestion('2')
      expect(useQuizStore.getState().currentQuestionId).toBe('2')
    })

    it('does nothing when id not found in questions', () => {
      useQuizStore.getState().setQuestions(sampleQuestions)
      useQuizStore.getState().setCurrentQuestion('99')
      expect(useQuizStore.getState().currentQuestionId).toBe('1')
    })
  })

  describe('submitAnswer', () => {
    it('adds to answeredQuestions and increments numCorrectAnswers when correct', () => {
      useQuizStore.getState().setQuestions(sampleQuestions)
      useQuizStore.getState().submitAnswer('1', '1')
      const state = useQuizStore.getState()
      expect(state.answeredQuestions).toHaveLength(1)
      expect(state.answeredQuestions[0]).toEqual({
        questionId: '1',
        selectedAnswerId: '1',
        correctAnswerId: '1',
      })
      expect(state.numCorrectAnswers).toBe(1)
    })

    it('adds to answeredQuestions without incrementing when incorrect', () => {
      useQuizStore.getState().setQuestions(sampleQuestions)
      useQuizStore.getState().submitAnswer('1', '2')
      const state = useQuizStore.getState()
      expect(state.answeredQuestions).toHaveLength(1)
      expect(state.numCorrectAnswers).toBe(0)
    })

    it('sets isComplete when all questions answered', () => {
      useQuizStore.getState().setQuestions(sampleQuestions)
      useQuizStore.getState().submitAnswer('1', '1')
      useQuizStore.getState().submitAnswer('2', '2')
      expect(useQuizStore.getState().isComplete).toBe(true)
    })

    it('sets error when question not found', () => {
      useQuizStore.getState().setQuestions(sampleQuestions)
      useQuizStore.getState().submitAnswer('99', '1')
      expect(useQuizStore.getState().error).toBe('Question not found')
    })
  })

  describe('completeQuiz', () => {
    it('sets isComplete to true', () => {
      useQuizStore.getState().setQuestions(sampleQuestions)
      useQuizStore.getState().completeQuiz()
      expect(useQuizStore.getState().isComplete).toBe(true)
    })
  })

  describe('resetQuiz', () => {
    it('resets to initialState', () => {
      useQuizStore.getState().setQuestions(sampleQuestions)
      useQuizStore.getState().submitAnswer('1', '1')
      useQuizStore.getState().resetQuiz()
      const state = useQuizStore.getState()
      expect(state.questions).toEqual([])
      expect(state.currentQuestionId).toBeNull()
      expect(state.answeredQuestions).toEqual([])
      expect(state.isComplete).toBe(false)
      expect(state.numCorrectAnswers).toBe(0)
      expect(state.error).toBeNull()
    })
  })
})
