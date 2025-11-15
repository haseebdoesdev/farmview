import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FarmerDashboard = () => {
  const [data, setData] = useState([]);
  const [weather, setWeather] = useState({});
  const [advice, setAdvice] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const { t } = useTranslation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
    fetchWeather();
    fetchAdvice();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/farmer/market-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeather = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/farmer/weather/Karachi', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWeather(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdvice = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/farmer/advice', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdvice(res.data.advice);
    } catch (err) {
      console.error(err);
    }
  };

  const getChartData = (item) => {
    const itemData = data.filter(d => d.item === item).slice(0, 7);
    return {
      labels: itemData.map(d => new Date(d.date).toLocaleDateString()),
      datasets: [{
        label: `${item} ${t('farmerDashboard.price')}`,
        data: itemData.map(d => d.price),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      }]
    };
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
            <h1 style={{ margin: 0, fontSize: '24px' }}>{t('farmerDashboard.title')}</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="/forum" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                {t('farmerDashboard.forumLink')}
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
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div className="card">
            <h3 style={{ marginTop: 0, color: '#2d8659', marginBottom: '16px' }}>
              {t('farmerDashboard.weather')}
            </h3>
            {weather.main ? (
              <div>
                <p style={{ fontSize: '18px', margin: '8px 0' }}>
                  <strong>{t('farmerDashboard.temperature')}:</strong> {weather.main.temp}°C
                </p>
                <p style={{ fontSize: '18px', margin: '8px 0' }}>
                  <strong>{t('farmerDashboard.humidity')}:</strong> {weather.main.humidity}%
                </p>
                {weather.weather && weather.weather[0] && (
                  <p style={{ fontSize: '16px', margin: '8px 0', textTransform: 'capitalize' }}>
                    {weather.weather[0].description}
                  </p>
                )}
              </div>
            ) : (
              <p style={{ color: '#6c757d' }}>Loading weather data...</p>
            )}
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0, color: '#2d8659', marginBottom: '16px' }}>
              {t('farmerDashboard.advice')}
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8' }}>{advice}</p>
          </div>
        </div>
        <div className="card">
          <h2 style={{ marginTop: 0, color: '#2d8659', marginBottom: '20px' }}>
            {t('farmerDashboard.priceTrends')}
          </h2>
          <select 
            onChange={(e) => setSelectedItem(e.target.value)}
            style={{ marginBottom: '20px', maxWidth: '300px' }}
          >
            <option value="">{t('farmerDashboard.selectItem')}</option>
            {[...new Set(data.map(d => d.item))].map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          {selectedItem && (
            <div style={{ marginTop: '20px' }}>
              <Line data={getChartData(selectedItem)} />
            </div>
          )}
        </div>
        <div className="card" style={{ overflowX: 'auto' }}>
          <h2 style={{ marginTop: 0, color: '#2d8659', marginBottom: '20px' }}>
            {t('farmerDashboard.marketData')}
          </h2>
          {data.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>
              No market data available.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>{t('adminDashboard.item')}</th>
                  <th>{t('adminDashboard.price')}</th>
                  <th>{t('adminDashboard.region')}</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map(d => (
                  <tr key={d._id}>
                    <td style={{ fontWeight: '600' }}>{d.item}</td>
                    <td>${d.price}</td>
                    <td>{d.region}</td>
                    <td>{new Date(d.date).toLocaleDateString()}</td>
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

export default FarmerDashboard;
