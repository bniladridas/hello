import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PostForm from './PostForm'

describe('PostForm', () => {
  const mockOnSave = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    mockOnSave.mockClear()
    mockOnCancel.mockClear()
  })

  test('renders form with inputs and buttons', () => {
    render(<PostForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    expect(screen.getByPlaceholderText('Post Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Post Content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  test('calls onSave with title and content on submit', () => {
    render(<PostForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    const titleInput = screen.getByPlaceholderText('Post Title')
    const contentTextarea = screen.getByPlaceholderText('Post Content')
    const saveButton = screen.getByRole('button', { name: /save/i })

    fireEvent.change(titleInput, { target: { value: 'New Title' } })
    fireEvent.change(contentTextarea, { target: { value: 'New Content' } })
    fireEvent.click(saveButton)

    expect(mockOnSave).toHaveBeenCalledWith({ title: 'New Title', content: 'New Content' })
  })

  test('resets form after submit', () => {
    render(<PostForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    const titleInput = screen.getByPlaceholderText('Post Title')
    const contentTextarea = screen.getByPlaceholderText('Post Content')

    fireEvent.change(titleInput, { target: { value: 'Title' } })
    fireEvent.change(contentTextarea, { target: { value: 'Content' } })
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(titleInput.value).toBe('')
    expect(contentTextarea.value).toBe('')
  })

  test('calls onCancel when cancel button is clicked', () => {
    render(<PostForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  test('populates form when currentPost is provided', () => {
    const currentPost = { title: 'Edit Title', content: 'Edit Content' }
    render(<PostForm currentPost={currentPost} onSave={mockOnSave} onCancel={mockOnCancel} />)

    expect(screen.getByDisplayValue('Edit Title')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Edit Content')).toBeInTheDocument()
  })
})
