import { render } from '@testing-library/react'
import { expectNoA11yViolations } from '../../test/utils'
import Badge from './index'

describe('Badge', () => {
  it('renders with check variant by default', () => {
    const { container } = render(<Badge />)
    const badge = container.querySelector('.badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('badge--check')
    const icon = container.querySelector('.badge__icon')
    expect(icon).toBeInTheDocument()
  })

  it('renders check icon when variant is check', () => {
    const { container } = render(<Badge variant="check" />)
    const badge = container.querySelector('.badge.badge--check')
    expect(badge).toBeInTheDocument()
    const img = container.querySelector('img.badge__icon')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', expect.any(String))
  })

  it('applies custom className', () => {
    const { container } = render(<Badge className="badge--corner" />)
    const badge = container.querySelector('.badge.badge--corner')
    expect(badge).toBeInTheDocument()
  })

  it('has aria-hidden on wrapper', () => {
    const { container } = render(<Badge />)
    const badge = container.querySelector('.badge')
    expect(badge).toHaveAttribute('aria-hidden', 'true')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Badge variant="check" />)
    await expectNoA11yViolations(container)
  })
})
