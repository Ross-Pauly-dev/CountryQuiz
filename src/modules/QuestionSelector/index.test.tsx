import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import QuestionSelector from './index'
import { createMockQuizStore, sampleQuestions } from '../../test/mocks/quizStore'
import { expectNoA11yViolations } from '../../test/utils'

vi.mock('../../store/quizStore', () => ({
  useQuizStore: vi.fn(),
}))

const { useQuizStore } = await import('../../store/quizStore')

describe('QuestionSelector', () => {
  beforeEach(() => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [],
      })
    )
  })

  it('renders question buttons', () => {
    render(<QuestionSelector />)
    expect(screen.getByRole('radio', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '2' })).toBeInTheDocument()
  })

  it('calls setCurrentQuestion when a question is clicked', async () => {
    const setCurrentQuestion = vi.fn()
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [],
        setCurrentQuestion,
      })
    )
    render(<QuestionSelector />)
    await userEvent.click(screen.getByRole('radio', { name: '2' }))
    expect(setCurrentQuestion).toHaveBeenCalledWith('2')
  })

  it('toggle group has aria-label Question number', () => {
    const { container } = render(<QuestionSelector />)
    const group = container.querySelector('[aria-label="Question number"]')
    expect(group).toBeInTheDocument()
  })

  it('question buttons are focusable', () => {
    render(<QuestionSelector />)
    const button1 = screen.getByRole('radio', { name: '1' })
    button1.focus()
    expect(document.activeElement).toBe(button1)
  })

  it('shows correct/incorrect styling for answered questions', () => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '2',
        answeredQuestions: [
          {
            questionId: '1',
            selectedAnswerId: '1',
            correctAnswerId: '1',
          },
        ],
      })
    )
    const { container } = render(<QuestionSelector />)
    const correctButton = container.querySelector('.question-button--correct')
    expect(correctButton).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<QuestionSelector />)
    await expectNoA11yViolations(container)
  })
})
