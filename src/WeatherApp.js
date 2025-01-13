import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaCloudSun,
  FaTemperatureHigh,
  FaWind,
  FaMapMarkerAlt,
  FaCloud,
  FaSun,
  FaCloudRain,
  FaSnowflake,
  FaMoon,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "./WeatherApp.css";

const WeatherApp = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");

  const API_KEY = "745d34f812fb42feb978f3c715095b5a";

  const fetchWeatherData = async (city) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const weatherResponse = await axios.get(URL);
      const forecastResponse = await axios.get(FORECAST_URL);

      setWeatherData(weatherResponse.data);

      const dailyForecast = forecastResponse.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecastData(dailyForecast.slice(0, 5));
      setError(null);
    } catch (err) {
      setWeatherData(null);
      setForecastData([]);
      setError("City not found! Please try again.");
    }
  };

  const handleSearch = () => {
    if (location.trim() !== "") {
      fetchWeatherData(location);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long", day: "numeric", month: "short" };
    return date.toLocaleDateString(undefined, options);
  };

  const getWeatherIcon = (weatherCondition) => {
    switch (weatherCondition) {
      case "Clear":
        return theme === "light" ? (
          <FaSun className="text-warning" />
        ) : (
          <FaMoon className="text-light" />
        );
      case "Rain":
        return <FaCloudRain className="text-info" />;
      case "Snow":
        return <FaSnowflake className="text-primary" />;
      case "Clouds":
        return <FaCloud className="text-secondary" />;
      case "Thunderstorm":
        return <FaCloudRain className="text-danger" />;
      default:
        return <FaCloud className="text-muted" />;
    }
  };

  return (
    <div className={`container mt-5 weather-app ${theme}`}>
      <div className="text-center">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h1
            className={`mb-4 text-${theme === "light" ? "primary" : "light"}`}
          >
            Weather Whisperer
          </h1>
          <button className="btn btn-outline-secondary" onClick={toggleTheme}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </header>
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city name"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {weatherData && (
          <>
            <motion.div
              className="card mx-auto shadow-lg weather-card mb-4"
              style={{ maxWidth: "400px" }}
            >
              <div className="card-body text-center">
                <h3 className="card-title">
                  <FaMapMarkerAlt /> {weatherData.name},{" "}
                  {weatherData.sys.country}
                </h3>
                <h4 className="mb-3">{formatDate(new Date())}</h4>
                <h4>
                  {getWeatherIcon(weatherData.weather[0].main)}{" "}
                  {weatherData.weather[0].description}
                </h4>
                <h2 className="my-3">
                  <FaTemperatureHigh className="text-danger" />{" "}
                  {weatherData.main.temp}&deg;C
                </h2>
                <p>
                  <FaWind className="text-info" /> Wind:{" "}
                  {weatherData.wind.speed} m/s
                </p>
              </div>
            </motion.div>
            <h3 className="mb-4">Five-Day Forecast</h3>
            <h6>Lets see how will be the weather for next five days</h6>
            <div className="d-flex justify-content-between flex-wrap">
              {forecastData.map((forecast, index) => (
                <div
                  key={index}
                  className="card text-center shadow-lg forecast-card mb-3"
                  style={{ width: "140px" }}
                >
                  <div className="card-body">
                    <p>{formatDate(forecast.dt_txt)}</p>
                    {getWeatherIcon(forecast.weather[0].main)}
                    <p>{forecast.main.temp}&deg;C</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
