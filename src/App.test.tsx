import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import App from './App'
import { createMockQuizStore, sampleQuestions } from './test/mocks/quizStore'

const routerInitialEntries = vi.hoisted(() => ({ value: ['/'] as string[] }))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={routerInitialEntries.value} initialIndex={0}>
        {children}
      </MemoryRouter>
    ),
  }
})

vi.mock('./store/quizStore', () => ({
  useQuizStore: vi.fn(),
}))

vi.mock('./queries/questions', () => ({
  useQuestionsQuery: vi.fn(),
}))

const { useQuizStore } = await import('./store/quizStore')
const { useQuestionsQuery } = await import('./queries/questions')

const mockQuestionsQueryReturn = {
  data: sampleQuestions,
  isPending: false,
  error: null,
  isError: false,
  isSuccess: true,
  status: 'success' as const,
  fetchStatus: 'idle' as const,
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
}

describe('App', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  beforeEach(() => {
    vi.mocked(useQuestionsQuery).mockReturnValue(mockQuestionsQueryReturn as unknown as ReturnType<typeof useQuestionsQuery>)
  })

  const renderApp = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )

  it('redirects / to /quiz', () => {
    routerInitialEntries.value = ['/']
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [],
      })
    )
    renderApp()
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
  })

  it('renders QuizInProgress at /quiz', () => {
    routerInitialEntries.value = ['/quiz']
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [],
      })
    )
    renderApp()
    expect(screen.getByRole('heading', { name: 'Country Quiz' })).toBeInTheDocument()
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
  })

  it('renders Results at /results when quiz is complete', () => {
    routerInitialEntries.value = ['/results']
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        isComplete: true,
        numCorrectAnswers: 2,
      })
    )
    renderApp()
    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument()
    expect(screen.getByText(/You got 2 out of 2 correct/)).toBeInTheDocument()
  })

  it('redirects to /quiz when accessing /results and quiz not complete', () => {
    routerInitialEntries.value = ['/results']
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        isComplete: false,
      })
    )
    renderApp()
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Results' })).not.toBeInTheDocument()
  })
})
