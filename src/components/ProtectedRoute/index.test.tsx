import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import ProtectedRoute from './index'

vi.mock('../../store/quizStore', () => ({
  useQuizStore: vi.fn(),
}))

const { useQuizStore } = await import('../../store/quizStore')

const renderProtectedRoute = (initialRoute = '/results') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <div>Protected content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/quiz" element={<div>Quiz page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('renders children when isComplete is true', () => {
    vi.mocked(useQuizStore).mockReturnValue({
      isComplete: true,
    } as ReturnType<typeof useQuizStore>)
    renderProtectedRoute()
    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })

  it('redirects to /quiz when isComplete is false', () => {
    vi.mocked(useQuizStore).mockReturnValue({
      isComplete: false,
    } as ReturnType<typeof useQuizStore>)
    renderProtectedRoute()
    expect(screen.getByText('Quiz page')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })
})
