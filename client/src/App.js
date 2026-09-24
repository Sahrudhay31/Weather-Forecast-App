import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const apiBase = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiBase}/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to fetch weather data.');
      }

      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-card">
      <h2>Weather Forecast</h2>
      <form onSubmit={fetchWeather} className="search-bar">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? '...' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div>
          <h3>{weather.city}, {weather.country}</h3>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.condition}
          />
          <div className="temp">{weather.temp}°C</div>
          <div className="desc">{weather.description}</div>
          <div className="stats">
            <div>Humidity: <strong>{weather.humidity}%</strong></div>
            <div>Wind: <strong>{weather.wind_speed} m/s</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;