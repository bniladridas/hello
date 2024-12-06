// src/BlogList.js
import React from 'react';
import Post from './Post';

const BlogList = ({ posts, onEdit, onDelete }) => {
  return (
    <div className="blog-list">
      {posts.map((post) => (
        <Post key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default BlogList;