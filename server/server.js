require('dotenv').config();
const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City query parameter is required.' });
  }

  const cacheKey = city.toLowerCase().trim();
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json({ ...cachedData, cached: true });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cacheKey)}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Weather lookup failed' });
    }

    const sanitizedData = {
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon
    };

    cache.set(cacheKey, sanitizedData);
    res.status(200).json({ ...sanitizedData, cached: false });
  } catch (err) {
    res.status(500).json({ error: 'Internal proxy server failure.' });
  }
});

app.listen(PORT, () => {
  console.log(`Weather proxy server operational on port ${PORT}`);
});
