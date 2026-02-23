import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expectNoA11yViolations } from '../../test/utils'
import Button from './index'

describe('Button', () => {
  it('renders label', () => {
    render(<Button label="Click me" onPress={() => {}} />)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <Button onPress={() => {}}>
        Submit
      </Button>
    )
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('calls onPress when clicked', async () => {
    const onPress = vi.fn()
    render(<Button label="Click" onPress={onPress} />)
    await userEvent.click(screen.getByRole('button', { name: 'Click' }))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('uses aria-label when provided', () => {
    render(
      <Button label="Visible" aria-label="Screen reader label" onPress={() => {}} />
    )
    expect(screen.getByRole('button', { name: 'Screen reader label' })).toBeInTheDocument()
  })

  it('forwards ref to button element', () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<Button ref={ref} label="Ref test" onPress={() => {}} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('is focusable and activates on Enter/Space', async () => {
    const onPress = vi.fn()
    render(<Button label="Focus test" onPress={onPress} />)
    const button = screen.getByRole('button', { name: 'Focus test' })
    button.focus()
    expect(document.activeElement).toBe(button)
    await userEvent.keyboard('{Enter}')
    expect(onPress).toHaveBeenCalled()
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Button label="Accessible" onPress={() => {}} />)
    await expectNoA11yViolations(container)
  })
})
