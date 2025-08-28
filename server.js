const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fetch = require('node-fetch'); // npm install node-fetch@2
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"]
      },
    },
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'src/pages')));

// Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src/pages/index.html')));
app.get('/visitor', (req, res) => res.sendFile(path.join(__dirname, 'src/pages/visitor.html')));
app.get('/parking', (req, res) => res.sendFile(path.join(__dirname, 'src/pages/parking.html')));

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// Proxy endpoint
app.post('/api/submit', async (req, res) => {
  try {
    const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('Failed to parse JSON:', text);
      return res.status(500).json({ success: false, message: 'Invalid JSON from Apps Script' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error submitting to Google Apps Script:', err);
    res.status(500).json({ success: false, message: 'Failed to submit data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
