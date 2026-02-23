import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithRouter } from '../../test/utils'
import Results from './index'
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

describe('Results', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders score', () => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        numCorrectAnswers: 2,
      })
    )
    renderWithRouter(<Results />, { route: '/results' })
    expect(screen.getByText(/You got 2 out of 2 correct/)).toBeInTheDocument()
  })

  it('score text is associated with Results heading', () => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        numCorrectAnswers: 1,
      })
    )
    renderWithRouter(<Results />, { route: '/results' })
    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument()
    expect(screen.getByText(/You got 1 out of 2 correct/)).toBeInTheDocument()
  })

  it('calls resetQuiz and navigates to /quiz when Generate new quiz is clicked', async () => {
    const resetQuiz = vi.fn()
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        resetQuiz,
      })
    )
    renderWithRouter(<Results />, { route: '/results' })
    await userEvent.click(screen.getByRole('button', { name: 'Generate new quiz' }))
    expect(resetQuiz).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/quiz')
  })
})
