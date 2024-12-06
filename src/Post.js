// src/Post.js
import React from 'react';

const Post = ({ post, onEdit, onDelete }) => {
  return (
    <div className="post">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <button onClick={() => onEdit(post.id)}>Edit</button>
      <button onClick={() => onDelete(post.id)}>Delete</button>
    </div>
  );
};

export default Post;