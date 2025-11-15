const express = require('express');
const MarketData = require('../models/MarketData');
const auth = require('../middleware/auth');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Get market data
router.get('/market-data', auth, async (req, res) => {
  try {
    const data = await MarketData.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get weather data
router.get('/weather/:city', auth, async (req, res) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY || 'your_api_key';
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${apiKey}&units=metric`);
    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: 'Weather data unavailable' });
  }
});

// Get advice based on weather
router.get('/advice', auth, async (req, res) => {
  try {
    const city = req.query.city || 'Karachi';
    const apiKey = process.env.WEATHER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiKey) {
      return res.json({ advice: "Check weather before watering crops." });
    }

    let weatherData = null;
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      weatherData = weatherResponse.data;
    } catch (err) {
      return res.json({ advice: "Check weather conditions before planning your farming activities." });
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    
    // CORRECTED: Using the latest stable 'gemini-2.5-flash'
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const weatherInfo = {
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      condition: weatherData.weather[0].description,
      windSpeed: weatherData.wind?.speed || 0,
      feelsLike: weatherData.main.feels_like
    };

    const prompt = `Based on the following weather conditions in ${city}, provide a brief, practical farming advice (2-3 sentences maximum):
- Temperature: ${weatherInfo.temperature}°C
- Humidity: ${weatherInfo.humidity}%
- Condition: ${weatherInfo.condition}
- Wind Speed: ${weatherInfo.windSpeed} m/s
- Feels Like: ${weatherInfo.feelsLike}°C

Give concise, actionable advice for farmers.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const advice = response.text().trim();

    res.json({ advice });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.json({ advice: "Check weather conditions before planning your farming activities." });
  }
});

module.exports = router;