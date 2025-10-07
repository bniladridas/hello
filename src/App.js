import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, limit, query } from 'firebase/firestore';
import { Pencil, Save, Trash, Eye, Globe, X, FileText } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';
import PropTypes from 'prop-types';



// Post Component
const Post = ({ post, onEdit, onDelete, onPreview }) => {
  return (
    <div className="post bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{post.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date(post.createdAt?.toDate?.() || new Date()).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onPreview(post)}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
            aria-label={`Preview ${post.title}`}
          >
            <Eye size={20} />
          </button>
          <button 
            onClick={() => onEdit(post.id)}
            className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition"
            aria-label={`Edit ${post.title}`}
          >
            <Pencil size={20} />
          </button>
          <button 
            onClick={() => onDelete(post.id)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
            aria-label={`Delete ${post.title}`}
          >
            <Trash size={20} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{post.content}</p>
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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title"
        className="w-full text-2xl font-light mb-4 border-b pb-2 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        required
        aria-label="Post Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post Content"
        className="w-full min-h-[200px] resize-none text-lg font-light focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        required
        aria-label="Post Content"
      />
      <div className="flex justify-end mt-4 space-x-2">
        <button 
          type="submit" 
          className="flex items-center bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100"
          aria-label="Save Post"
        >
          <Save className="mr-2" size={20} />
          Save
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="flex items-center bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          aria-label="Cancel"
        >
          Cancel
        </button>
      </div>
    </form>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-3xl relative max-h-[90vh] overflow-y-auto m-4">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
          aria-label="Close Preview"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-light mb-4 dark:text-white">{post.title}</h2>
        <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 font-sans">
        <header className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Globe className="text-blue-500" size={36} />
               <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                 Hello
               </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ToggleSwitch isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
            </div>
          </div>


        </header>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:sticky md:top-4 self-start">
              <PostForm
                currentPost={currentPost}
                onSave={handleSavePost}
                onCancel={handleCancel}
              />
            </div>
            <div>
              <h2 className="text-xl font-light mb-4 flex items-center text-gray-800 dark:text-white">
                <FileText className="mr-2" /> Posts
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