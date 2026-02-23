import { render, screen } from '@testing-library/react'
import { ToggleButtonGroup } from 'react-aria-components'
import { expectNoA11yViolations } from '../../test/utils'
import QuestionButton from './index'

const renderInGroup = (props: React.ComponentProps<typeof QuestionButton>) =>
  render(
    <ToggleButtonGroup
      aria-label="Questions"
      selectionMode="single"
      selectedKeys={props.currentlySelected ? new Set([props.questionId]) : new Set(['2'])}
      disallowEmptySelection
    >
      <QuestionButton {...props} />
      <QuestionButton questionId="2" label="2" isAnswered={false} currentlySelected={false} />
    </ToggleButtonGroup>
  )

describe('QuestionButton', () => {
  it('renders label', () => {
    render(
      <QuestionButton
        questionId="1"
        label="1"
        isAnswered={false}
        currentlySelected={false}
      />
    )
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
  })

  it('sets data-current-question when currentlySelected', () => {
    render(
      <QuestionButton
        questionId="1"
        label="1"
        isAnswered={false}
        currentlySelected
      />
    )
    const button = screen.getByRole('button', { name: '1' })
    expect(button).toHaveAttribute('data-current-question', 'true')
  })

  it('applies selected class when currentlySelected', () => {
    const { container } = render(
      <QuestionButton
        questionId="1"
        label="1"
        isAnswered={false}
        currentlySelected
      />
    )
    const button = container.querySelector('.question-button--selected')
    expect(button).toBeInTheDocument()
  })

  it('applies correct class when answered correctly', () => {
    const { container } = render(
      <QuestionButton
        questionId="1"
        label="1"
        isAnswered
        currentlySelected={false}
        isCorrect
      />
    )
    const button = container.querySelector('.question-button--correct')
    expect(button).toBeInTheDocument()
  })

  it('applies incorrect class when answered incorrectly', () => {
    const { container } = render(
      <QuestionButton
        questionId="1"
        label="1"
        isAnswered
        currentlySelected={false}
        isCorrect={false}
      />
    )
    const button = container.querySelector('.question-button--incorrect')
    expect(button).toBeInTheDocument()
  })

  it('exposes selected state via aria-checked', () => {
    renderInGroup({
      questionId: '1',
      label: '1',
      isAnswered: false,
      currentlySelected: true,
    })
    const button = screen.getByRole('radio', { name: '1', checked: true })
    expect(button).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <QuestionButton
        questionId="1"
        label="1"
        isAnswered={false}
        currentlySelected={false}
      />
    )
    await expectNoA11yViolations(container)
  })
})
