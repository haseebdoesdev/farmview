import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageModal from './LanguageModal';
import i18n from '../i18n';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setShowModal(true);
    } catch (err) {
      alert(t('login.failed'));
    }
  };

  const handleLanguageSelect = (lang) => {
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/farmer');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    const role = localStorage.getItem('role');
    if (role === 'admin') navigate('/admin');
    else navigate('/farmer');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2d8659 0%, #3da372 100%)',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: '24px', 
          color: '#2d8659',
          textAlign: 'center',
          fontSize: '28px'
        }}>
          {t('login.title')}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="text" 
            placeholder={t('login.username')} 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder={t('login.password')} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            {t('login.button')}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6c757d' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#2d8659', textDecoration: 'none', fontWeight: '600' }}>
            {t('login.registerLink')}
          </a>
        </p>
      </div>
      <LanguageModal isOpen={showModal} onClose={handleModalClose} onSelectLanguage={handleLanguageSelect} />
    </div>
  );
};

export default Login;
