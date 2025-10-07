import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Github: () => <div data-testid="github-icon" />
}))

describe('Footer', () => {
  test('renders footer with GitHub link', () => {
    render(<Footer />)

    expect(screen.getByText('Follow us on:')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/bniladridas')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
