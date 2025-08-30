require('dotenv').config();
const express = require('express');
const app = express();

// Serve static files
app.use(express.static('src'));

// Dynamic config for front-end
app.get('/js/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.WEB_APP_URL = "${process.env.WEB_APP_URL}";`);
});


