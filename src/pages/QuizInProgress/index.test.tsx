import { screen, waitFor } from '@testing-library/react'
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

vi.mock('../../queries/questions', () => ({
  useQuestionsQuery: vi.fn(),
}))

const { useQuizStore } = await import('../../store/quizStore')
const { useQuestionsQuery } = await import('../../queries/questions')

describe('QuizInProgress', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    vi.mocked(useQuestionsQuery).mockReturnValue({
      data: sampleQuestions,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: true,
      status: 'success',
      fetchStatus: 'idle',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isRefetching: false,
      isLoading: false,
      isLoadingError: false,
      isPaused: false,
      isPlaceholderData: false,
      isRefetchError: false,
      isStale: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useQuestionsQuery>)
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
    expect(setQuestions.mock.calls[0][0]).toHaveLength(sampleQuestions.length)
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
