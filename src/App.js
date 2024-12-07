// App.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, limit, query } from 'firebase/firestore';
import { Pencil, Save, Trash, FileText, Eye, Menu, X } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import PropTypes from 'prop-types';

const MobileMenu = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="p-4">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          <nav className="mt-8">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => onNavigate('home')}
                className="text-left px-4 py-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('terms')}
                className="text-left px-4 py-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => onNavigate('privacy')}
                className="text-left px-4 py-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                Privacy Policy
              </button>
              <a 
                href="https://x.com/bniladridas"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Follow on X
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

const Post = ({ post, onEdit, onDelete, onPreview }) => {
  return (
    <div className="post bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-medium dark:text-white">{post.title}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => onPreview(post)}
            className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
            aria-label={`Preview ${post.title}`}
          >
            <Eye size={20} />
          </button>
          <button 
            onClick={() => onEdit(post.id)}
            className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
            aria-label={`Edit ${post.title}`}
          >
            <Pencil size={20} />
          </button>
          <button 
            onClick={() => onDelete(post.id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            aria-label={`Delete ${post.title}`}
          >
            <Trash size={20} />
          </button>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
    </div>
  );
};

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

const App = () => {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewPost, setPreviewPost] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Handle body scroll lock when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      console.error("Error fetching posts: ", error);
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

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
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
      console.error("Error saving post: ", error);
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        setError('');
      } catch (error) {
        setError('Failed to delete post.');
        console.error("Error deleting post: ", error);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto p-4 md:p-6 font-sans">
        <header className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-light text-gray-800 dark:text-white">
              Gravity Blog
            </h1>
            <div className="flex items-center space-x-4">
              <ToggleSwitch isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
              <button 
                onClick={toggleMenu}
                className="md:hidden p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                aria-label="Toggle Menu"
                aria-expanded={isMenuOpen}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          <nav className="hidden md:flex mt-4 space-x-6">
            <button 
              onClick={() => handleNavigate('home')}
              className={`text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white ${
                currentPage === 'home' ? 'font-medium' : ''
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigate('terms')}
              className={`text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white ${
                currentPage === 'terms' ? 'font-medium' : ''
              }`}
            >
              Terms of Service
            </button>
            <button 
              onClick={() => handleNavigate('privacy')}
              className={`text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white ${
                currentPage === 'privacy' ? 'font-medium' : ''
              }`}
            >
              Privacy Policy
            </button>
            <a 
              href="https://x.com/bniladridas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Follow on X
            </a>
          </nav>
        </header>

        <MobileMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)}
          onNavigate={handleNavigate}
        />

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        {currentPage === 'home' && (
          <>
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
          </>
        )}

        {currentPage === 'terms' && <TermsOfService />}
        {currentPage === 'privacy' && <PrivacyPolicy />}

        {previewPost && (
          <PostPreviewModal 
            post={previewPost} 
            onClose={handleClosePreview} 
          />
        )}

        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Gravity Blog</p>
        </footer>
      </div>
    </div>
  );
};

// PropTypes definitions
MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
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