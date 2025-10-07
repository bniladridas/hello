import React from 'react'
import PostForm from './PostForm'
import BlogList from './BlogList'

const BlogPage = ({ posts, currentPost, onSave, onCancel, onEdit, onDelete, onPreview }) => (
  <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
    <div className='lg:col-span-1'>
      <PostForm currentPost={currentPost} onSave={onSave} onCancel={onCancel} />
    </div>
    <div className='lg:col-span-2'>
      <BlogList
        posts={posts}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}
      />
    </div>
  </div>
)

export default BlogPage
