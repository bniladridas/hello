// src/App.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, limit, query } from 'firebase/firestore';
import { Pencil, Save, Trash, FileText, Eye, Menu } from 'lucide-react';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import PropTypes from 'prop-types';

const Post = ({ post, onEdit, onDelete, onPreview }) => {
  return (
    <div className="post bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-medium">{post.title}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => onPreview(post)}
            className="text-gray-600 hover:text-black"
            aria-label={`Preview ${post.title}`}
          >
            <Eye size={20} />
          </button>
          <button 
            onClick={() => onEdit(post.id)}
            className="text-gray-600 hover:text-black"
            aria-label={`Edit ${post.title}`}
          >
            <Pencil size={20} />
          </button>
          <button 
            onClick={() => onDelete(post.id)}
            className="text-red-600 hover:text-red-800"
            aria-label={`Delete ${post.title}`}
          >
            <Trash size={20} />
          </button>
        </div>
      </div>
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
};

const PostPreviewModal = ({ post, onClose }) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.classList.contains('modal-backdrop')) {
        onClose();
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-backdrop">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl relative max-h-screen overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          aria-label="Close Preview"
        >
          &times;
        </button>
        <h2 className="text-2xl font-light mb-4">{post.title}</h2>
        <p className="text-gray-700">{post.content}</p>
      </div>
    </div>
  );
};

PostPreviewModal.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

const BlogList = ({ posts, onEdit, onDelete, onPreview }) => {
  return (
    <div className="blog-list">
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Start writing!</p>
      ) : (
        posts.map((post) => (
          <Post key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
        ))
      )}
    </div>
  );
};

BlogList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
};

const PostForm = ({ currentPost, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (currentPost) {
      setTitle(currentPost.title);
      setContent(currentPost.content);
    }
  }, [currentPost]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
        className="w-full text-2xl font-light mb-4 border-b pb-2 focus:outline-none"
        required
        aria-label="Post Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post Content"
        className="w-full min-h-[300px] resize-none text-lg font-light focus:outline-none"
        required
        aria-label="Post Content"
      />
      <div className="flex justify-end mt-4">
        <button 
          type="submit" 
          className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 mr-2"
          aria-label="Save Post"
        >
          <Save className="mr-2" size={20} />
          Save
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="flex items-center bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          aria-label="Cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

PostForm.propTypes = {
  currentPost: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const App = () => {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewPost, setPreviewPost] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch posts in real-time with a limit of 40
  useEffect(() => {
    const q = query(collection(db, 'posts'), limit(40));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
      setLoading(false);
      setError('');
    }, (error) => {
      setError('Failed to fetch posts.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSavePost = async (post) => {
    if (post.title.trim() === '' || post.content.trim() === '') {
      setError('Title and content are required.');
      return;
    }

    try {
      if (editingId) {
        // Optimistically update the UI
        setPosts(posts.map(p => (p.id === editingId ? { ...p, ...post } : p)));

        // Update existing post
        const postRef = doc(db, 'posts', editingId);
        await updateDoc(postRef, {
          title: post.title,
          content: post.content
        });
        setError('');
      } else {
        // Optimistically update the UI
        setPosts([{ id: Date.now().toString(), ...post, createdAt: new Date() }, ...posts]);

        // Add new post
        await addDoc(collection(db, 'posts'), {
          title: post.title,
          content: post.content,
          createdAt: new Date()
        });
        setError('');
      }

      // Reset form
      setCurrentPost(null);
      setEditingId(null);
    } catch (error) {
      // Revert UI changes if operation fails
      setPosts(posts.filter(p => p.id !== editingId));
      setError('Failed to save post.');
      console.error("Error saving post: ", error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      // Optimistically update the UI
      setPosts(posts.filter(post => post.id !== id));

      // Delete post
      await deleteDoc(doc(db, 'posts', id));
      setError('');
    } catch (error) {
      // Revert UI changes if operation fails
      setPosts(posts);
      setError('Failed to delete post.');
      console.error("Error deleting post: ", error);
    }
  };

  const handleEditPost = (id) => {
    const post = posts.find(post => post.id === id);
    if (post) {
      setCurrentPost({ title: post.title, content: post.content });
      setEditingId(id);
    }
  };

  const handleCancel = () => {
    setCurrentPost(null);
    setEditingId(null);
    setError('');
  };

  const handlePreviewPost = (post) => {
    setPreviewPost(post);
  };

  const handleClosePreview = () => {
    setPreviewPost(null);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <header className="mb-8 border-b pb-4 flex justify-between items-center">
        <h1 className="text-3xl font-light text-gray-800">Gravity Blog</h1>
        <button 
          onClick={toggleMenu} 
          className="text-gray-600 hover:text-black md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu size={24} />
        </button>
        <nav className={`md:flex md:flex-row space-y-2 md:space-y-0 md:space-x-4 ${isMenuOpen ? 'menu-open' : 'menu-closed'}`}>
          <button onClick={() => handleNavigate('home')} className="text-gray-600 hover:text-black">
            Home
          </button>
          <button onClick={() => handleNavigate('terms')} className="text-gray-600 hover:text-black">
            Terms of Service
          </button>
          <button onClick={() => handleNavigate('privacy')} className="text-gray-600 hover:text-black">
            Privacy Policy
          </button>
          <a href="https://x.com/bniladridas" target="_blank" rel="noopener noreferrer" className="text-blue-500">
            Follow on X
          </a>
        </nav>
      </header>

      {currentPage === 'home' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div>
              <div className="mb-8">               
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Writing Area */}
                <PostForm 
                  currentPost={currentPost} 
                  onSave={handleSavePost} 
                  onCancel={handleCancel} 
                />

                {/* Posts List */}
                <div>
                  <h2 className="text-xl font-light mb-4 flex items-center">
                    <FileText className="mr-2" /> Posts
                  </h2>
                  <BlogList posts={posts} onEdit={handleEditPost} onDelete={handleDeletePost} onPreview={handlePreviewPost} />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {currentPage === 'terms' && <TermsOfService />}
      {currentPage === 'privacy' && <PrivacyPolicy />}

      {previewPost && <PostPreviewModal post={previewPost} onClose={handleClosePreview} />}

      <footer className="mt-12 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Gravity Blog</p>
        <p>
          <a href="https://www.linkedin.com/in/bniladridas/" target="_blank" rel="noopener noreferrer" className="text-blue-500">
            Connect with CEO on LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;