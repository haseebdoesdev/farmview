import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [region, setRegion] = useState('');
  const { t } = useTranslation();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/market-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/market-data', { item, price, region }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      setItem('');
      setPrice('');
      setRegion('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/market-data/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
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
            <h1 style={{ margin: 0, fontSize: '24px' }}>{t('adminDashboard.title')}</h1>
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
      </header>
      <div className="container" style={{ paddingTop: '40px' }}>
        <div className="card">
          <h2 style={{ marginTop: 0, color: '#2d8659', marginBottom: '20px' }}>
            Add Market Data
          </h2>
          <form onSubmit={handleSubmit} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '8px'
          }}>
            <input 
              type="text" 
              placeholder={t('adminDashboard.item')} 
              value={item} 
              onChange={(e) => setItem(e.target.value)} 
              required 
            />
            <input 
              type="number" 
              placeholder={t('adminDashboard.price')} 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder={t('adminDashboard.region')} 
              value={region} 
              onChange={(e) => setRegion(e.target.value)} 
              required 
            />
            <button type="submit" className="btn btn-primary">
              {t('adminDashboard.addButton')}
            </button>
          </form>
        </div>
        <div className="card" style={{ overflowX: 'auto' }}>
          <h2 style={{ marginTop: 0, color: '#2d8659', marginBottom: '20px' }}>
            Market Data
          </h2>
          {data.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>
              No market data available. Add some data to get started.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>{t('adminDashboard.item')}</th>
                  <th>{t('adminDashboard.price')}</th>
                  <th>{t('adminDashboard.region')}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(d => (
                  <tr key={d._id}>
                    <td style={{ fontWeight: '600' }}>{d.item}</td>
                    <td>${d.price}</td>
                    <td>{d.region}</td>
                    <td>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(d._id)}
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                      >
                        {t('adminDashboard.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
