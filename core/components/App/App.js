import React, { useState, useEffect } from 'react'
import { db } from '../../firebase/config'
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  limit,
  query,
  orderBy
} from 'firebase/firestore'
import { Pencil, Trash, Eye, X, Menu, Home, FileText, Shield } from 'lucide-react'

import PropTypes from 'prop-types'
import BlogPage from './BlogPage'
import PrivacyPolicy from '../../pages/PrivacyPolicy'
import TermsOfService from '../../pages/TermsOfService'

// Post Component
const Post = ({ post, onEdit, onDelete, onPreview }) => {
  return (
    <div className='bg-white dark:bg-gray-800 p-6 mb-6'>
      <div className='flex justify-between items-start mb-3'>
        <h3 className='text-xl font-semibold text-gray-900 dark:text-white flex-1 leading-tight'>
          {post.title}
        </h3>
        <div className='flex space-x-1 ml-4'>
          <button
            onClick={() => onPreview(post)}
            className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            aria-label={`Preview ${post.title}`}
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(post.id)}
            className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            aria-label={`Edit ${post.title}`}
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            aria-label={`Delete ${post.title}`}
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
      <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mt-2'>
        {post.content}
      </p>
    </div>
  )
}

// Post Form Component
const PostForm = ({ currentPost, onSave, onCancel }) => {
  const [title, setTitle] = useState(currentPost?.title || '')
  const [content, setContent] = useState(currentPost?.content || '')

  useEffect(() => {
    if (currentPost) {
      setTitle(currentPost.title)
      setContent(currentPost.content)
    }
  }, [currentPost])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ title, content })
    setTitle('')
    setContent('')
  }

  return (
    <div className='bg-white dark:bg-gray-800 p-6'>
      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Post title'
            className='w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-gray-400 dark:focus:border-gray-400 text-gray-900 dark:text-white text-xl font-semibold placeholder-gray-400 dark:placeholder-gray-500'
            required
            aria-label='Post Title'
          />
        </div>
        <div className='mb-6'>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='Write your thoughts...'
            className='w-full min-h-[150px] px-0 py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-300 text-base leading-relaxed resize-none placeholder-gray-400 dark:placeholder-gray-500'
            required
            aria-label='Post Content'
          />
        </div>
        <div className='flex justify-end'>
          {currentPost && (
            <button
              type='button'
              onClick={onCancel}
              className='px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              aria-label='Cancel'
            >
              Cancel
            </button>
          )}
          <button
            type='submit'
            className='px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm hover:bg-gray-800 dark:hover:bg-gray-100'
            aria-label='Save Post'
          >
            {currentPost ? 'Update' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Blog List Component
const BlogList = ({ posts, onEdit, onDelete, onPreview }) => {
  return (
    <div className='blog-list'>
      {posts.length === 0
        ? (
          <p className='text-gray-500 dark:text-gray-400'>No posts yet. Start writing!</p>
          )
        : (
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onEdit={onEdit}
                onDelete={onDelete}
                onPreview={onPreview}
              />
            ))
          )}
    </div>
  )
}

// Post Preview Modal Component
const PostPreviewModal = ({ post, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden'>
        <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex justify-between items-start'>
            <h2 className='text-xl font-medium text-gray-900 dark:text-white pr-4'>{post.title}</h2>
            <button
              onClick={onClose}
              className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              aria-label='Close Preview'
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className='p-6 overflow-y-auto max-h-[60vh]'>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap'>
            {post.content}
          </p>
        </div>
      </div>
    </div>
  )
}

// Main App Component
const App = () => {
  const [posts, setPosts] = useState([])
  const [currentPost, setCurrentPost] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [previewPost, setPreviewPost] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentView, setCurrentView] = useState('blog')

  // Fetch posts from Firebase
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(40))
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setPosts(fetchedPosts)
        setLoading(false)
        setError('')
      },
      (error) => {
        setError('Failed to fetch posts.')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSavePost = async (post) => {
    if (post.title.trim() === '' || post.content.trim() === '') {
      setError('Title and content are required.')
      return
    }

    try {
      if (editingId) {
        const postRef = doc(db, 'posts', editingId)
        await updateDoc(postRef, {
          title: post.title,
          content: post.content,
          updatedAt: new Date()
        })
      } else {
        await addDoc(collection(db, 'posts'), {
          title: post.title,
          content: post.content,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      setError('')
      setCurrentPost(null)
      setEditingId(null)
    } catch (error) {
      setError('Failed to save post.')
    }
  }

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', id))
        setError('')
      } catch (error) {
        setError('Failed to delete post.')
      }
    }
  }

  const handleEditPost = (id) => {
    const post = posts.find((post) => post.id === id)
    if (post) {
      setCurrentPost(post)
      setEditingId(id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleCancel = () => {
    setCurrentPost(null)
    setEditingId(null)
    setError('')
  }

  const handlePreviewPost = (post) => {
    setPreviewPost(post)
  }

  const handleClosePreview = () => {
    setPreviewPost(null)
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
      <div className='max-w-4xl mx-auto px-4 md:px-6 py-8'>
        <header className='mb-12 pb-6'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className='p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                aria-label='Open menu'
              >
                <Menu size={20} />
              </button>
              <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>Hello</h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className='text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              aria-label='Toggle dark mode'
            >
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </header>

        {error && <div className='mb-6 p-4 text-red-700 dark:text-red-300'>{error}</div>}

        {loading
          ? (
            <div>
              <div className='text-sm text-gray-500 dark:text-gray-400 mb-4'>Loading posts...</div>
              <div className='space-y-6'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='bg-white dark:bg-gray-800 p-6 animate-pulse'>
                    <div className='flex justify-between items-start mb-3'>
                      <div className='flex-1'>
                        <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2' />
                        <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4' />
                      </div>
                      <div className='flex space-x-1'>
                        <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded' />
                        <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded' />
                        <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded' />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded' />
                      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6' />
                      <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )
          : (
            <BlogPage
              posts={posts}
              currentPost={currentPost}
              onSave={handleSavePost}
              onCancel={handleCancel}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onPreview={handlePreviewPost}
            />
            )}

        {previewPost && <PostPreviewModal post={previewPost} onClose={handleClosePreview} />}

        {currentView === 'privacy' && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden'>
              <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
                <div className='flex justify-between items-start'>
                  <h2 className='text-xl font-medium text-gray-900 dark:text-white pr-4'>Privacy Policy</h2>
                  <button
                    onClick={() => setCurrentView('blog')}
                    className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                    aria-label='Close'
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className='p-6 overflow-y-auto max-h-[60vh]'>
                <PrivacyPolicy />
              </div>
            </div>
          </div>
        )}

        {currentView === 'terms' && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white dark:bg-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden'>
              <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
                <div className='flex justify-between items-start'>
                  <h2 className='text-xl font-medium text-gray-900 dark:text-white pr-4'>Terms of Service</h2>
                  <button
                    onClick={() => setCurrentView('blog')}
                    className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                    aria-label='Close'
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className='p-6 overflow-y-auto max-h-[60vh]'>
                <TermsOfService />
              </div>
            </div>
          </div>
        )}

        <>
          {isDrawerOpen && (
            <div
              className='fixed inset-0 bg-black bg-opacity-50 z-40'
              onClick={() => setIsDrawerOpen(false)}
            />
          )}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-700 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className='p-4'>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className='mb-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
                aria-label='Close menu'
              >
                <X size={20} />
              </button>
               <nav>
                 <ul className='space-y-2'>
                   <li>
                     <button
                       onClick={() => {
                         setCurrentView('blog')
                         setIsDrawerOpen(false)
                       }}
                       className='flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left'
                     >
                       <Home size={18} className='mr-3' />
                       Home
                     </button>
                   </li>
                   <li>
                     <button
                       onClick={() => {
                         setCurrentView('privacy')
                         setIsDrawerOpen(false)
                       }}
                       className='flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left'
                     >
                       <Shield size={18} className='mr-3' />
                       Privacy Policy
                     </button>
                   </li>
                   <li>
                     <button
                       onClick={() => {
                         setCurrentView('terms')
                         setIsDrawerOpen(false)
                       }}
                       className='flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left'
                     >
                       <FileText size={18} className='mr-3' />
                       Terms of Service
                     </button>
                   </li>
                 </ul>
               </nav>
            </div>
          </div>
        </>
      </div>
    </div>
  )
}

// PropTypes definitions

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date)
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired
}

PostPreviewModal.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

BlogList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired
}

PostForm.propTypes = {
  currentPost: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default App
