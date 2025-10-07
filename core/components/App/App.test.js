import { render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import App from './App'

test('renders Hello title', () => {
  render(
    <HashRouter>
      <App />
    </HashRouter>
  )
  const titleElement = screen.getByText(/Hello/i)
  expect(titleElement).toBeInTheDocument()
})
