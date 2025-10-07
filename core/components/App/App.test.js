import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

test('renders Hello title', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
  const titleElement = screen.getByText(/Hello/i)
  expect(titleElement).toBeInTheDocument()
})
