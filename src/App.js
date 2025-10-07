import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, limit, query } from 'firebase/firestore';
import { Pencil, Save, Trash, Eye, Globe, X, FileText } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';
import PropTypes from 'prop-types';



// Post Component
const Post = ({ post, onEdit, onDelete, onPreview }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{post.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date(post.createdAt?.toDate?.() || new Date()).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-1 ml-4">
          <button
            onClick={() => onPreview(post)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            aria-label={`Preview ${post.title}`}
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(post.id)}
            className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            aria-label={`Edit ${post.title}`}
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            aria-label={`Delete ${post.title}`}
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">{post.content}</p>
    </div>
  );
};

// Post Form Component
const PostForm = ({ currentPost, onSave, onCancel }) => {
  const [title, setTitle] = useState(currentPost?.title || '');
  const [content, setContent] = useState(currentPost?.content || '');

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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
        {currentPost ? 'Edit Post' : 'New Post'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            required
            aria-label="Post Title"
          />
        </div>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            className="w-full min-h-[120px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm resize-none"
            required
            aria-label="Post Content"
          />
        </div>
        <div className="flex justify-end space-x-3">
          {currentPost && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              aria-label="Cancel"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label="Save Post"
          >
            {currentPost ? 'Update' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Blog List Component
const BlogList = ({ posts, onEdit, onDelete, onPreview }) => {
  return (
    <div className="blog-list">
      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No posts yet. Start writing!</p>
      ) : (
        posts.map((post) => (
          <Post key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} onPreview={onPreview} />
        ))
      )}
    </div>
  );
};

// Post Preview Modal Component
const PostPreviewModal = ({ post, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white pr-4">{post.title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close Preview"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {new Date(post.createdAt?.toDate?.() || new Date()).toLocaleDateString()}
          </p>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewPost, setPreviewPost] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });



  // Fetch posts from Firebase
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

  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };



  const handleSavePost = async (post) => {
    if (post.title.trim() === '' || post.content.trim() === '') {
      setError('Title and content are required.');
      return;
    }

    try {
      if (editingId) {
        const postRef = doc(db, 'posts', editingId);
        await updateDoc(postRef, {
          title: post.title,
          content: post.content,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'posts'), {
          title: post.title,
          content: post.content,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      setError('');
      setCurrentPost(null);
      setEditingId(null);
    } catch (error) {
      setError('Failed to save post.');
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        setError('');
      } catch (error) {
        setError('Failed to delete post.');
      }
    }
  };

  const handleEditPost = (id) => {
    const post = posts.find(post => post.id === id);
    if (post) {
      setCurrentPost(post);
      setEditingId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <header className="mb-12 pb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Globe className="text-blue-600 dark:text-blue-400" size={32} />
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Hello
              </h1>
            </div>
            <ToggleSwitch isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
          </div>


        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <PostForm
                currentPost={currentPost}
                onSave={handleSavePost}
                onCancel={handleCancel}
              />
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">
                Posts
              </h2>
              <BlogList
                posts={posts}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onPreview={handlePreviewPost}
              />
            </div>
          </div>
        )}



        {previewPost && (
          <PostPreviewModal 
            post={previewPost} 
            onClose={handleClosePreview} 
          />
        )}


      </div>
    </div>
  );
};

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
  onPreview: PropTypes.func.isRequired,
};

PostPreviewModal.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
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

PostForm.propTypes = {
  currentPost: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default App;