import { render, screen } from '@testing-library/react'
import { expectNoA11yViolations } from '../../test/utils'
import Header from './index'

describe('Header', () => {
  it('renders "Country Quiz" heading', () => {
    render(<Header />)
    expect(screen.getByRole('heading', { name: 'Country Quiz' })).toBeInTheDocument()
  })

  it('has exactly one h1', () => {
    render(<Header />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent('Country Quiz')
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<Header />)
    await expectNoA11yViolations(container)
  })
})
