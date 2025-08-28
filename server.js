const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch'); // npm install node-fetch@2
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(morgan(process.env.LOG_LEVEL || 'combined'));
app.use(express.json({ limit: process.env.MAX_FILE_SIZE || '10mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.MAX_FILE_SIZE || '10mb' }));

// Apply rate limiting to all requests
app.use(limiter);

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

// Serve config.js dynamically to the browser
app.get('/js/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.WEB_APP_URL = "${process.env.GOOGLE_SCRIPT_URL || ''}";`);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'src/pages')));

// Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'src/pages/index.html')));
app.get('/visitor', (req, res) => res.sendFile(path.join(__dirname, 'src/pages/visitor.html')));
app.get('/parking', (req, res) => res.sendFile(path.join(__dirname, 'src/pages/parking.html')));

// Health check with environment info
app.get('/health', (req, res) => res.json({ 
  status: 'OK', 
  timestamp: new Date().toISOString(),
  environment: NODE_ENV,
  port: PORT,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));

// Proxy endpoint
app.post('/api/submit', async (req, res) => {
  try {
    if (!process.env.GOOGLE_SCRIPT_URL) {
      return res.status(500).json({ 
        success: false, 
        message: 'Google Script URL not configured. Please set GOOGLE_SCRIPT_URL in your .env file.' 
      });
    }

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔒 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  console.log(`📊 Rate Limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || 100} requests per ${process.env.RATE_LIMIT_WINDOW_MS || 900000}ms`);
  if (process.env.GOOGLE_SCRIPT_URL) {
    console.log(`✅ Google Script URL configured`);
  } else {
    console.log(`⚠️  Google Script URL not configured - set GOOGLE_SCRIPT_URL in .env file`);
  }
});

module.exports = app;
