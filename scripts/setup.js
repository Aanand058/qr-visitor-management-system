#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Configuration
const CONFIG = {
  projectName: 'QR Visitor Management System',
  requiredNodeVersion: '16.0.0',
  requiredNpmVersion: '8.0.0'
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${step} ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check Node.js version
function checkNodeVersion() {
  const nodeVersion = process.version;
  const requiredVersion = CONFIG.requiredNodeVersion;
  
  logStep('1', 'Checking Node.js version...');
  
  if (process.version < `v${requiredVersion}`) {
    logError(`Node.js version ${requiredVersion} or higher is required. Current version: ${nodeVersion}`);
    process.exit(1);
  }
  
  logSuccess(`Node.js version ${nodeVersion} is compatible`);
}

// Check npm version
function checkNpmVersion() {
  logStep('2', 'Checking npm version...');
  
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    const requiredVersion = CONFIG.requiredNpmVersion;
    
    if (npmVersion < requiredVersion) {
      logWarning(`npm version ${requiredVersion} or higher is recommended. Current version: ${npmVersion}`);
    } else {
      logSuccess(`npm version ${npmVersion} is compatible`);
    }
  } catch (error) {
    logWarning('Could not determine npm version');
  }
}

// Install dependencies
function installDependencies() {
  logStep('3', 'Installing dependencies...');
  
  try {
    logInfo('Running npm install...');
    execSync('npm install', { stdio: 'inherit' });
    logSuccess('Dependencies installed successfully');
  } catch (error) {
    logError('Failed to install dependencies');
    logError('Please run "npm install" manually');
    process.exit(1);
  }
}

// Create environment file
function createEnvFile() {
  logStep('4', 'Creating environment configuration...');
  
  const envContent = `# Environment Configuration for QR Visitor Management System

# Server Configuration
PORT=3000
NODE_ENV=development

# Google Apps Script Configuration
GOOGLE_SCRIPT_URL=YOUR_GOOGLE_APPS_SCRIPT_URL_HERE

# Google Sheets IDs (if using Google Sheets)
VISITORS_SHEET_ID=YOUR_VISITORS_SHEET_ID_HERE
PARKING_SHEET_ID=YOUR_PARKING_SHEET_ID_HERE

# Security Configuration
SESSION_SECRET=your_session_secret_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/
`;

  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    logSuccess('.env file created successfully');
    logWarning('Please update the .env file with your actual configuration values');
  } else {
    logInfo('.env file already exists, skipping creation');
  }
}

// Create directories
function createDirectories() {
  logStep('5', 'Creating necessary directories...');
  
  const directories = [
    'public',
    'logs',
    'uploads',
    'data',
    'backups'
  ];
  
  directories.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logSuccess(`Created directory: ${dir}`);
    } else {
      logInfo(`Directory already exists: ${dir}`);
    }
  });
}

// Generate QR codes
function generateQRCodes() {
  logStep('6', 'Generating QR codes...');
  
  try {
    logInfo('Running QR code generator...');
    execSync('npm run generate-qr', { stdio: 'inherit' });
    logSuccess('QR codes generated successfully');
  } catch (error) {
    logWarning('Failed to generate QR codes automatically');
    logInfo('You can run "npm run generate-qr" manually later');
  }
}

// Create setup instructions
function createSetupInstructions() {
  logStep('7', 'Creating setup instructions...');
  
  const instructionsContent = `# Setup Instructions for QR Visitor Management System

## 🚀 Quick Start

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment**
   - Update the \`.env\` file with your configuration
   - Set your Google Apps Script URL if using Google Sheets
   - Configure admin credentials

3. **Start the Server**
   \`\`\`bash
   npm start
   \`\`\`

4. **Access the Application**
   - Main app: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Health check: http://localhost:3000/health

## 🔧 Configuration

### Google Apps Script Setup (Optional)
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Copy the code from \`src/backend/google-apps-script.js\`
4. Deploy as a web app
5. Update the \`GOOGLE_SCRIPT_URL\` in your \`.env\` file

### Google Sheets Setup (Optional)
1. Create two Google Sheets:
   - Visitors sheet
   - Parking sheet
2. Update the sheet IDs in your \`.env\` file
3. Run the setup function in Google Apps Script

## 📱 QR Code Generation

Generate QR codes for your deployment:
\`\`\`bash
npm run generate-qr -- --url https://yourdomain.com
\`\`\`

## 🚀 Deployment

### Local Development
\`\`\`bash
npm run dev
\`\`\`

### Production
\`\`\`bash
npm start
\`\`\`

## 📊 Features

- ✅ Visitor registration
- ✅ Parking permit management
- ✅ Admin dashboard
- ✅ Data export
- ✅ QR code generation
- ✅ Google Sheets integration
- ✅ RESTful API
- ✅ Form validation
- ✅ Security features

## 🔒 Security

- Rate limiting enabled
- Input validation
- CORS protection
- Helmet security headers
- Environment variable configuration

## 📝 API Endpoints

- \`POST /api/visitor\` - Submit visitor entry
- \`POST /api/parking\` - Submit parking permit
- \`GET /api/visitors\` - Get all visitors
- \`GET /api/parking\` - Get all parking entries
- \`GET /api/dashboard\` - Get dashboard statistics
- \`DELETE /api/visitor/:id\` - Delete visitor entry
- \`DELETE /api/parking/:id\` - Delete parking entry

## 🆘 Support

If you encounter any issues:
1. Check the console logs
2. Verify your configuration
3. Ensure all dependencies are installed
4. Check the health endpoint: /health

## 📚 Documentation

- README.md - Main project documentation
- API documentation available at /api/health
- Google Apps Script documentation in src/backend/google-apps-script.js
`;

  const instructionsPath = path.join(process.cwd(), 'SETUP.md');
  fs.writeFileSync(instructionsPath, instructionsContent);
  logSuccess('Setup instructions created: SETUP.md');
}

// Display final information
function displayFinalInfo() {
  logStep('8', 'Setup completed successfully! 🎉');
  
  log('\n📋 Next Steps:', 'bright');
  log('1. Update the .env file with your configuration', 'reset');
  log('2. Start the server with: npm start', 'reset');
  log('3. Access the app at: http://localhost:3000', 'reset');
  log('4. Check SETUP.md for detailed instructions', 'reset');
  
  log('\n🔗 Useful Commands:', 'bright');
  log('  npm start          - Start the server', 'reset');
  log('  npm run dev        - Start in development mode', 'reset');
  log('  npm run generate-qr - Generate QR codes', 'reset');
  log('  npm run setup      - Run this setup again', 'reset');
  
  log('\n📱 Access Points:', 'bright');
  log('  Main App:          http://localhost:3000', 'reset');
  log('  Admin Panel:       http://localhost:3000/admin', 'reset');
  log('  Health Check:      http://localhost:3000/health', 'reset');
  log('  API Base:          http://localhost:3000/api', 'reset');
  
  log('\n🎯 Your QR Visitor Management System is ready to use!', 'green');
}

// Main setup function
function runSetup() {
  try {
    log(`\n${colors.bright}${colors.cyan}🚀 Welcome to ${CONFIG.projectName} Setup!${colors.reset}\n`);
    
    checkNodeVersion();
    checkNpmVersion();
    installDependencies();
    createEnvFile();
    createDirectories();
    generateQRCodes();
    createSetupInstructions();
    displayFinalInfo();
    
  } catch (error) {
    logError('Setup failed with error:');
    logError(error.message);
    process.exit(1);
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  runSetup();
}

module.exports = {
  runSetup,
  checkNodeVersion,
  checkNpmVersion,
  installDependencies,
  createEnvFile,
  createDirectories,
  generateQRCodes
};
