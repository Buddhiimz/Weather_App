import React, { useState, useEffect } from 'react';
import axios from 'axios';
import search_icon from '../assets/search.png';
import clear from '../assets/clear.png';
import humidity from '../assets/humidity.png';
import wind from '../assets/wind.png';
import rain from '../assets/rain.png';
import cloud from '../assets/cloud.png';
import drizzle from '../assets/drizzle.png';
import snow from '../assets/snow.png';
import mist from '../assets/mist.png';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allIcons = {
    "01d": clear, "01n": clear,
    "02d": cloud, "02n": cloud,
    "03d": cloud, "03n": cloud,
    "04d": drizzle, "04n": drizzle,
    "09d": rain, "09n": rain,
    "11d": rain, "11n": rain,
    "13d": snow, "13n": snow,
    "50d": mist, "50n": mist
  };

  const searchWeather = async (city) => {
    if (!city) return;
    setLoading(true);
    setError(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        throw new Error(data.message);
      }

      const icon = allIcons[data.weather[0]?.icon] || clear;

      setWeatherData({
        humidity: data.main.humidity,
        wind: data.wind.speed,
        temp: Math.floor(data.main.temp),
        location: data.name,
        icon,
      });
    } catch (error) {
      console.error(error.message);
      setError(error.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${import.meta.env.VITE_APP_ID}`
      );
      const cities = response.data.map((item) => `${item.name}, ${item.country}`);
      setSuggestions(cities);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    searchWeather('London');
  }, []);

  const handleSearch = (cityName) => {
    setCity(cityName);
    setSuggestions([]);
    searchWeather(cityName);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4 font-[Poppins] bg-gradient-to-br from-[#1e3a8a] to-[#0c1f4a]">
      <div className="w-full max-w-lg  p-4 sm:p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-md">
        {/* Search Section */}
        <div className="relative mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search city..."
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white/20 border border-white/30 
                          backdrop-blur-sm text-white placeholder-white/60 focus:outline-none 
                          focus:ring-2 focus:ring-sky-400 transition-all duration-300 font-light
                          text-sm sm:text-base"
              />
              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md 
                             rounded-2xl shadow-lg overflow-hidden border border-white/20 z-50">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 sm:px-6 py-2 sm:py-3 cursor-pointer hover:bg-white/20 
                               transition-colors text-white border-b border-white/10 last:border-none 
                               font-light text-sm sm:text-base"
                      onClick={() => handleSearch(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={() => handleSearch(city)}
              className="p-3 sm:p-4 rounded-2xl bg-sky-500 hover:bg-sky-600 transition-colors
                       shadow-lg hover:shadow-xl active:scale-95 transform duration-200"
            >
              <img src={search_icon} alt="search" className="w-5 h-5 sm:w-6 sm:h-6 object-contain brightness-0 invert" />
            </button>
          </div>
        </div>

        {/* Weather Display */}
        {loading ? (
          <div className="flex justify-center items-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-sky-400 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4 sm:p-6 bg-red-500/10 rounded-2xl border border-red-500/20">
            <p className="text-red-200 font-light text-sm sm:text-base">{error}</p>
          </div>
        ) : weatherData ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Main Weather Info */}
            <div className="text-center space-y-3 sm:space-y-4">
              <img
                src={weatherData.icon}
                alt="weather-icon"
                className="w-24 h-24 sm:w-32 sm:h-32 mx-auto drop-shadow-2xl"
              />
              <div className="space-y-1 sm:space-y-2">
                <p className="text-5xl sm:text-7xl font-light text-white">{weatherData.temp}°C</p>
                <p className="text-3xl sm:text-5xl text-white/90 font-light">{weatherData.location}</p>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Humidity Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-sky-400/20 rounded-xl">
                    <img src={humidity} alt="humidity" className="w-5 h-5 sm:w-6 sm:h-6 brightness-0 invert" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-medium text-white">{weatherData.humidity}%</p>
                    <p className="text-xs sm:text-sm text-white/70 font-light">Humidity</p>
                  </div>
                </div>
              </div>

              {/* Wind Speed Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-sky-400/20 rounded-xl">
                    <img src={wind} alt="wind" className="w-5 h-5 sm:w-6 sm:h-6 brightness-0 invert" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-medium text-white">{weatherData.wind} km/h</p>
                    <p className="text-xs sm:text-sm text-white/70 font-light">Wind Speed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 sm:p-6 bg-white/10 rounded-2xl border border-white/20">
            <p className="text-white/70 font-light text-sm sm:text-base">Enter a city name to get weather information</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;