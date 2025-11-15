import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password, role });
      navigate('/');
    } catch (err) {
      alert(t('register.failed'));
    }
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
          {t('register.title')}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="text" 
            placeholder={t('register.username')} 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder={t('register.password')} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="farmer">{t('register.farmer')}</option>
            <option value="admin">{t('register.admin')}</option>
          </select>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            {t('register.button')}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6c757d' }}>
          Already have an account?{' '}
          <a href="/" style={{ color: '#2d8659', textDecoration: 'none', fontWeight: '600' }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
