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
      const res = await axios.get('http://localhost:5000/api/farmer/advice?city=Karachi', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdvice(res.data.advice);
    } catch (err) {
      console.error(err);
    }
  };

  const getChartData = (item) => {
    const itemData = data
    .filter(d => d.item === item)
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // oldest to newest
    .slice(0, 7);
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
          <div className="card" style={{
            background: 'linear-gradient(135deg, #2d8659 0%, #3da372 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                  {t('farmerDashboard.weather')}
                </h3>
                {weather.weather && weather.weather[0] && (
                  <span style={{ fontSize: '32px' }}>
                    {weather.weather[0].main === 'Clear' ? '☀️' : 
                     weather.weather[0].main === 'Clouds' ? '☁️' :
                     weather.weather[0].main === 'Rain' ? '🌧️' :
                     weather.weather[0].main === 'Drizzle' ? '🌦️' :
                     weather.weather[0].main === 'Thunderstorm' ? '⛈️' :
                     weather.weather[0].main === 'Snow' ? '❄️' :
                     weather.weather[0].main === 'Mist' || weather.weather[0].main === 'Fog' ? '🌫️' : '🌤️'}
                  </span>
                )}
              </div>
              {weather.main ? (
                <div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'baseline', 
                    marginBottom: '16px',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '48px', fontWeight: '700', lineHeight: '1' }}>
                      {Math.round(weather.main.temp)}°
                    </span>
                    <span style={{ fontSize: '24px', opacity: 0.9 }}>C</span>
                  </div>
                  {weather.weather && weather.weather[0] && (
                    <p style={{ 
                      fontSize: '16px', 
                      marginBottom: '20px',
                      textTransform: 'capitalize',
                      opacity: 0.95,
                      fontWeight: '500'
                    }}>
                      {weather.weather[0].description}
                    </p>
                  )}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '12px', 
                        opacity: 0.8,
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {t('farmerDashboard.humidity')}
                      </p>
                      <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                        {weather.main.humidity}%
                      </p>
                    </div>
                    {weather.wind && (
                      <div>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '12px', 
                          opacity: 0.8,
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Wind
                        </p>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                          {weather.wind.speed} m/s
                        </p>
                      </div>
                    )}
                    {weather.main.feels_like && (
                      <div>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '12px', 
                          opacity: 0.8,
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Feels Like
                        </p>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                          {Math.round(weather.main.feels_like)}°C
                        </p>
                      </div>
                    )}
                    {weather.name && (
                      <div>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '12px', 
                          opacity: 0.8,
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Location
                        </p>
                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                          {weather.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Loading weather data...</p>
                </div>
              )}
            </div>
          </div>
          <div className="card" style={{
            background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '-30px',
              width: '100px',
              height: '100px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '50%'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                  {t('farmerDashboard.advice')}
                </h3>
                <span style={{ fontSize: '32px' }}>💡</span>
              </div>
              {advice ? (
                <div>
                  <p style={{ 
                    fontSize: '16px', 
                    lineHeight: '1.8',
                    margin: 0,
                    opacity: 0.95,
                    fontWeight: '400'
                  }}>
                    {advice}
                  </p>
                  {/* MOVED THIS DIV TO BE DIRECTLY UNDER THE PARAGRAPH */}
                  <div style={{
                    marginTop: '20px', // Maintain spacing from the advice paragraph
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '14px', opacity: 0.8 }}>✨</span>
                    <span style={{ fontSize: '12px', opacity: 0.7, fontStyle: 'italic' }}>
                      AI-powered farming insights
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Loading advice...</p>
                </div>
              )}
            </div>
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