const express = require('express');
const axios = require('axios');
const router = express.Router();

const GNEWS_API_KEY = "fa56119a897afc948884f5ad6183b15b";

router.get('/environment-news', async (req, res) => {
  try {
    const keywords = `"beach cleanup" OR "plastic pollution" OR "ocean pollution" OR "marine conservation" OR "climate change"`;
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(keywords)}&lang=en&country=in&max=10&apikey=${GNEWS_API_KEY}`;

    const response = await axios.get(url);
    res.status(200).json({ total: response.data.totalArticles, articles: response.data.articles });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch news' });
  }
});

module.exports = router;
