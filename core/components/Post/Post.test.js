import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Post from './Post'

describe('Post', () => {
  const mockPost = { id: 1, title: 'Test Title', content: 'Test Content' }
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()

  test('renders post title and content', () => {
    render(<Post post={mockPost} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  test('renders edit and delete buttons', () => {
    render(<Post post={mockPost} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  test('calls onEdit when edit button is clicked', () => {
    render(<Post post={mockPost} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(1)
  })

  test('calls onDelete when delete button is clicked', () => {
    render(<Post post={mockPost} onEdit={mockOnEdit} onDelete={mockOnDelete} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(1)
  })
})
