import { render, screen } from '@testing-library/react'
import App from './App'

test('renders Hello title', () => {
  render(<App />)
  const titleElement = screen.getByText(/Hello/i)
  expect(titleElement).toBeInTheDocument()
})
