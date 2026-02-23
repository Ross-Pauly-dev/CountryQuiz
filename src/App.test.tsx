import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from './App'
import { createMockQuizStore, sampleQuestions } from './test/mocks/quizStore'

const routerInitialEntries = vi.hoisted(() => ({ value: ['/'] as string[] }))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={routerInitialEntries.value}>
        {children}
      </MemoryRouter>
    ),
  }
})

vi.mock('./store/quizStore', () => ({
  useQuizStore: vi.fn(),
}))

const { useQuizStore } = await import('./store/quizStore')

describe('App', () => {
  it('redirects / to /quiz', () => {
    routerInitialEntries.value = ['/']
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [],
      })
    )
    render(<App />)
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
    render(<App />)
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
    render(<App />)
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
    render(<App />)
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Results' })).not.toBeInTheDocument()
  })
})
