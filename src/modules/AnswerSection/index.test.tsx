import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import AnswerSection from './index'
import { createMockQuizStore, sampleQuestions } from '../../test/mocks/quizStore'
import { expectNoA11yViolations } from '../../test/utils'

vi.mock('../../store/quizStore', () => ({
  useQuizStore: vi.fn(),
}))

const { useQuizStore } = await import('../../store/quizStore')

describe('AnswerSection', () => {
  beforeEach(() => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [],
      })
    )
  })

  it('renders question and answers', () => {
    render(<AnswerSection />)
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Paris' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'London' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Berlin' })).toBeInTheDocument()
  })

  it('calls submitAnswer when an answer is selected', async () => {
    const submitAnswer = vi.fn()
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [],
        submitAnswer,
      })
    )
    render(<AnswerSection />)
    await userEvent.click(screen.getByRole('radio', { name: 'Paris' }))
    expect(submitAnswer).toHaveBeenCalledWith('1', '1')
  })

  it('region has aria-labelledby pointing to question heading', () => {
    render(<AnswerSection />)
    const region = screen.getByRole('region', {
      name: 'What is the capital of France?',
    })
    expect(region).toBeInTheDocument()
    expect(region).toHaveAttribute('aria-labelledby', 'answer-section-question-1')
  })

  it('radio group has aria-labelledby matching question', () => {
    const { container } = render(<AnswerSection />)
    const radioGroup = container.querySelector('[role="radiogroup"]')
    expect(radioGroup).toHaveAttribute('aria-labelledby', 'answer-section-question-1')
  })

  it('arrow keys move focus between radio options', async () => {
    render(<AnswerSection />)
    const radios = screen.getAllByRole('radio')
    radios[0].focus()
    expect(document.activeElement).toBe(radios[0])
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(radios[1])
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(radios[2])
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(radios[0])
  })

  it('tab focuses first option when container receives focus', () => {
    render(<AnswerSection />)
    const optionsContainer = screen
      .getByRole('region', { name: 'What is the capital of France?' })
      .querySelector('div[tabindex="0"]') as HTMLElement
    expect(optionsContainer).toBeInTheDocument()
    fireEvent.focus(optionsContainer)
    const firstRadio = screen.getByRole('radio', { name: 'Paris' })
    expect(document.activeElement).toBe(firstRadio)
  })

  it('shows correct/incorrect styling after answer selected', () => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [
          {
            questionId: '1',
            selectedAnswerId: '1',
            correctAnswerId: '1',
          },
        ],
      })
    )
    const { container } = render(<AnswerSection />)
    const correctButton = container.querySelector('.answer-button__correct')
    expect(correctButton).toBeInTheDocument()
  })

  it('shows check mark Badge on correct answer when user answered incorrectly', () => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [
          {
            questionId: '1',
            selectedAnswerId: '2',
            correctAnswerId: '1',
          },
        ],
      })
    )
    render(<AnswerSection />)
    const parisRadio = screen.getByRole('radio', { name: 'Paris' })
    const parisButton = parisRadio.closest('.answer-button')
    const badge = parisButton?.querySelector('.badge')
    expect(badge).toBeInTheDocument()
  })

  it('has aria-live region that announces result when question is answered', () => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [
          {
            questionId: '1',
            selectedAnswerId: '1',
            correctAnswerId: '1',
          },
        ],
      })
    )
    render(<AnswerSection />)
    const liveRegion = document.querySelector('[aria-live="polite"]')
    expect(liveRegion).toBeInTheDocument()
    expect(liveRegion).toHaveTextContent('Correct. Paris.')
  })

  it('aria-live region shows incorrect message when user was wrong', () => {
    vi.mocked(useQuizStore).mockReturnValue(
      createMockQuizStore({
        questions: sampleQuestions,
        currentQuestionId: '1',
        answeredQuestions: [
          {
            questionId: '1',
            selectedAnswerId: '2',
            correctAnswerId: '1',
          },
        ],
      })
    )
    render(<AnswerSection />)
    const liveRegion = document.querySelector('[aria-live="polite"]')
    expect(liveRegion).toBeInTheDocument()
    expect(liveRegion).toHaveTextContent(
      'Incorrect. The correct answer was Paris.'
    )
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<AnswerSection />)
    await expectNoA11yViolations(container)
  })
})
