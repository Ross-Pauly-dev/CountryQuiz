import { render, screen } from '@testing-library/react'
import { expectNoA11yViolations } from '../../test/utils'
import Card from './index'

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <span>Card content</span>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies className', () => {
    const { container } = render(
      <Card className="custom-class">
        <span>Content</span>
      </Card>
    )
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('card')
    expect(card).toHaveClass('custom-class')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Card>
        <span>Content</span>
      </Card>
    )
    await expectNoA11yViolations(container)
  })
})
