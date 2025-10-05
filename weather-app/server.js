// Import dependencies
const express = require("express");
const morgan = require("morgan");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware
app.use(morgan("dev")); // logs requests

// API key & base URL (OpenWeatherMap free API)
const API_KEY = "ea35497dd66bac05de13e9c4515c16d1"; // your actual API key
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Route: Home
app.get("/", (req, res) => {
  res.send("🌤️ Welcome to Tiny Weather API Server");
});

// Route: Get current weather for a city
app.get("/weather/:city", async (req, res) => {
  const city = req.params.city;

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const data = response.data;
    res.json({
      city: data.name,
      temperature: `${data.main.temp} °C`,
      condition: data.weather[0].description,
    });
  } catch (error) {
    res.status(404).json({ error: "City not found or API error" });
  }
});

// Route: Get full 5-day forecast for a city
app.get("/forecast/:city", async (req, res) => {
  const city = req.params.city;

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const data = response.data;

    // Format the 5-day forecast (3-hour intervals)
    const forecast = data.list.map((item) => ({
      date: item.dt_txt,
      temperature: `${item.main.temp} °C`,
      condition: item.weather[0].description,
    }));

    res.json({
      city: data.city.name,
      forecast: forecast,
    });
  } catch (error) {
    res.status(404).json({ error: "Forecast not available or API error" });
  }
});

// Route: Get city coordinates
app.get("/coords/:city", async (req, res) => {
  const city = req.params.city;

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
      },
    });

    const data = response.data;
    res.json({
      city: data.name,
      coordinates: {
        latitude: data.coord.lat,
        longitude: data.coord.lon,
      },
    });
  } catch (error) {
    res.status(404).json({ error: "Coordinates not found or API error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
