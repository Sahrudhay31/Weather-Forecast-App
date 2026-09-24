const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Support both req.query.city and query params parsed from req.url
  let city = req.query && req.query.city;
  if (!city && req.url) {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      city = parsedUrl.searchParams.get('city');
    } catch (e) {
      // ignore url parse error
    }
  }

  if (!city || !city.trim()) {
    return res.status(400).json({ error: 'City query parameter is required.' });
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ 
      error: 'OPENWEATHER_API_KEY environment variable is not configured. Please add it to your Vercel Project Settings.' 
    });
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
      country: data.sys ? data.sys.country : '',
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind_speed: data.wind ? data.wind.speed : 0,
      condition: data.weather && data.weather[0] ? data.weather[0].main : '',
      description: data.weather && data.weather[0] ? data.weather[0].description : '',
      icon: data.weather && data.weather[0] ? data.weather[0].icon : ''
    };

    cache.set(cacheKey, sanitizedData);
    return res.status(200).json({ ...sanitizedData, cached: false });
  } catch (err) {
    return res.status(500).json({ error: 'Internal serverless proxy failure: ' + (err.message || err) });
  }
};
