import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const { t } = useTranslation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/forum/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/forum/posts', { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/forum/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments({ ...comments, [postId]: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/forum/posts/${postId}/comments`, { content: newComment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchComments(postId);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <header style={{
        background: '#2d8659',
        color: 'white',
        padding: '20px 0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '24px' }}>{t('forum.title')}</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="/farmer" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                Dashboard
              </a>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('role');
                  window.location.href = '/';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className="card">
          <h2 style={{ marginTop: 0, color: '#2d8659', marginBottom: '20px' }}>
            Create New Post
          </h2>
          <form onSubmit={handlePostSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="text" 
              placeholder={t('forum.postTitle')} 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
            <textarea 
              placeholder={t('forum.content')} 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required
              rows="4"
              style={{ resize: 'vertical' }}
            />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              {t('forum.postButton')}
            </button>
          </form>
        </div>
        <div>
          <h2 style={{ color: '#2d8659', marginBottom: '24px' }}>Community Posts</h2>
          {posts.length === 0 ? (
            <div className="card">
              <p style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>
                No posts yet. Be the first to post!
              </p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post._id} className="card" style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ 
                    marginTop: 0, 
                    marginBottom: '8px', 
                    color: '#2b2d42',
                    fontSize: '20px'
                  }}>
                    {post.title}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: '#6c757d', 
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{t('forum.by')}</span>
                    <strong>{post.author?.username || 'Unknown'}</strong>
                    <span style={{ marginLeft: '12px' }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <p style={{ 
                  marginBottom: '16px', 
                  lineHeight: '1.8',
                  whiteSpace: 'pre-wrap'
                }}>
                  {post.content}
                </p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => { 
                    setSelectedPost(post._id); 
                    fetchComments(post._id); 
                  }}
                  style={{ marginBottom: selectedPost === post._id ? '20px' : '0' }}
                >
                  {selectedPost === post._id ? 'Hide Comments' : t('forum.viewComments')}
                </button>
                {selectedPost === post._id && (
                  <div style={{ 
                    marginTop: '20px', 
                    paddingTop: '20px',
                    borderTop: '2px solid #dee2e6'
                  }}>
                    <h4 style={{ color: '#2d8659', marginBottom: '16px' }}>
                      {t('forum.comments')} ({comments[post._id]?.length || 0})
                    </h4>
                    {comments[post._id]?.length > 0 ? (
                      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {comments[post._id].map(comment => (
                          <div key={comment._id} style={{
                            padding: '12px',
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            borderLeft: '4px solid #2d8659'
                          }}>
                            <p style={{ margin: 0, marginBottom: '4px' }}>{comment.content}</p>
                            <p style={{ 
                              margin: 0, 
                              fontSize: '12px', 
                              color: '#6c757d' 
                            }}>
                              - {comment.author?.username || 'Unknown'}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                    <form onSubmit={(e) => handleCommentSubmit(e, post._id)} style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder={t('forum.commentPlaceholder')} 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        required
                        style={{ flex: 1 }}
                      />
                      <button type="submit" className="btn btn-primary">
                        {t('forum.commentButton')}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
