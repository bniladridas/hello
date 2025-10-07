import React from 'react'
import { render, screen } from '@testing-library/react'
import BlogList from './BlogList'

// Mock the Post component to avoid testing it here
jest.mock('./Post', () => {
  return function MockPost ({ post, onEdit, onDelete }) {
    return <div data-testid={`post-${post.id}`}>{post.title}</div>
  }
})

describe('BlogList', () => {
  const mockPosts = [
    { id: 1, title: 'First Post', content: 'Content 1' },
    { id: 2, title: 'Second Post', content: 'Content 2' }
  ]
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()

  test('renders a list of posts', () => {
    render(<BlogList posts={mockPosts} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByTestId('post-1')).toBeInTheDocument()
    expect(screen.getByTestId('post-2')).toBeInTheDocument()
    expect(screen.getByText('First Post')).toBeInTheDocument()
    expect(screen.getByText('Second Post')).toBeInTheDocument()
  })

  test('renders empty list when no posts', () => {
    render(<BlogList posts={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.queryByTestId(/post-/)).not.toBeInTheDocument()
  })
})
