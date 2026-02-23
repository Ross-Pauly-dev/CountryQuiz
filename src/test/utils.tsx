import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axe from 'axe-core'
import { expect } from 'vitest'

interface RenderWithRouterOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string
  initialEntries?: MemoryRouterProps['initialEntries']
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
}

export function renderWithRouter(
  ui: ReactElement,
  { route = '/', initialEntries, ...renderOptions }: RenderWithRouterOptions = {}
) {
  const queryClient = createTestQueryClient()
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries ?? [route]} initialIndex={0}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  )
  return render(ui, { wrapper, ...renderOptions })
}

export async function expectNoA11yViolations(container: HTMLElement) {
  const results = await axe.run(container)
  expect(results.violations).toHaveLength(0)
}
