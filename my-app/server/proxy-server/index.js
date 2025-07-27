const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const PORT = 5000;

const API_KEY = '9fec74c5aemsh4ac3b55485f72d7p106363jsn5458e724706a';
const API_HOST = 'travel-advisor.p.rapidapi.com';

// 🔍 General location search
app.get('/api/search', async (req, res) => {
  try {
    const response = await axios.get(`https://${API_HOST}/locations/search`, {
      params: {
        query: req.query.query,
        lang: 'en_US',
        units: 'km',
      },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error from /search:', error.message);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// 🏨 Hotel listings
app.get('/api/hotels', async (req, res) => {
  try {
    const response = await axios.get(`https://${API_HOST}/locations/search`, {
      params: {
        query: req.query.city,
        limit: '30',
        lang: 'en_US',
        units: 'km',
      },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error from /hotels:', error.message);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// ✨ Autocomplete suggestions
app.get('/api/suggestions', async (req, res) => {
  try {
    const response = await axios.get(`https://${API_HOST}/locations/auto-complete`, {
      params: {
        query: req.query.query,
        lang: 'en_US',
      },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error from /suggestions:', error.message);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
});
