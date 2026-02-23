import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithRouter } from '../../test/utils'
import QuizInProgress from './index'
import { createMockQuizStore, sampleQuestions } from '../../test/mocks/quizStore'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../../store/quizStore', () => ({
  useQuizStore: vi.fn(),
}))

const { useQuizStore } = await import('../../store/quizStore')

describe('QuizInProgress', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders Header, QuestionSelector, and AnswerSection', () => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [],
        isComplete: false,
      })
    )
    renderWithRouter(<QuizInProgress />, { route: '/quiz' })
    expect(screen.getByRole('heading', { name: 'Country Quiz' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '1' })).toBeInTheDocument()
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
  })

  it('calls setQuestions on mount', () => {
    const setQuestions = vi.fn()
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [],
        setQuestions,
      })
    )
    renderWithRouter(<QuizInProgress />, { route: '/quiz' })
    expect(setQuestions).toHaveBeenCalled()
    expect(setQuestions.mock.calls[0][0]).toHaveLength(5)
  })

  it('shows See results button when quiz is complete', () => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [],
        isComplete: true,
      })
    )
    renderWithRouter(<QuizInProgress />, { route: '/quiz' })
    expect(screen.getByRole('button', { name: 'See results' })).toBeInTheDocument()
  })

  it('navigates to /results when See results is clicked', async () => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [],
        isComplete: true,
      })
    )
    renderWithRouter(<QuizInProgress />, { route: '/quiz' })
    await userEvent.click(screen.getByRole('button', { name: 'See results' }))
    expect(mockNavigate).toHaveBeenCalledWith('/results')
  })

  it('See results button receives focus when quiz completes', async () => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [],
        isComplete: true,
      })
    )
    renderWithRouter(<QuizInProgress />, { route: '/quiz' })
    const seeResultsButton = screen.getByRole('button', { name: 'See results' })
    await waitFor(() => {
      expect(document.activeElement).toBe(seeResultsButton)
    })
  })
})
