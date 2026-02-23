import { render, screen } from '@testing-library/react'
import { RadioGroup } from 'react-aria-components'
import { expectNoA11yViolations } from '../../test/utils'
import AnswerButton from './index'

const renderAnswerButton = (props: React.ComponentProps<typeof AnswerButton>) =>
  render(
    <RadioGroup aria-label="Answers">
      <AnswerButton {...props} />
    </RadioGroup>
  )

describe('AnswerButton', () => {
  it('renders answer text', () => {
    renderAnswerButton({ answerId: '1', answerText: 'Paris' })
    expect(screen.getByRole('radio', { name: 'Paris' })).toBeInTheDocument()
  })

  it('has accessible name via aria-label', () => {
    renderAnswerButton({ answerId: '1', answerText: 'London' })
    expect(screen.getByRole('radio', { name: 'London' })).toBeInTheDocument()
  })

  it('shows disabled state when isDisabled is true', () => {
    renderAnswerButton({ answerId: '1', answerText: 'Paris', isDisabled: true })
    const radio = screen.getByRole('radio', { name: 'Paris' })
    expect(radio).toBeDisabled()
  })

  it('applies correct styling when showAsCorrect', () => {
    const { container } = renderAnswerButton({
      answerId: '1',
      answerText: 'Paris',
      showAsCorrect: true,
    })
    const radio = container.querySelector('.answer-button__correct')
    expect(radio).toBeInTheDocument()
  })

  it('applies incorrect styling when showAsIncorrect', () => {
    const { container } = renderAnswerButton({
      answerId: '1',
      answerText: 'London',
      showAsIncorrect: true,
    })
    const radio = container.querySelector('.answer-button__incorrect')
    expect(radio).toBeInTheDocument()
  })

  it('shows Badge when showCorrectCheckMark is true and still shows answer text', () => {
    const { container } = renderAnswerButton({
      answerId: '1',
      answerText: 'Paris',
      showCorrectCheckMark: true,
    })
    const badge = container.querySelector('.badge')
    expect(badge).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Paris' })).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = renderAnswerButton({
      answerId: '1',
      answerText: 'Paris',
    })
    await expectNoA11yViolations(container)
  })
})
