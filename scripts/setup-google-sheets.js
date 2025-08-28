#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

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

console.log(`${colors.bright}${colors.cyan}🚀 Google Sheets Integration Setup${colors.reset}\n`);

logStep('1', 'Google Drive Folder Setup');
log('   • Go to [drive.google.com](https://drive.google.com)', 'reset');
log('   • Create a new folder named "QR Visitor Management System"', 'reset');
log('   • Right-click the folder → Share → Copy link', 'reset');
log('   • Extract the folder ID from the URL', 'reset');
log('   • Example: https://drive.google.com/drive/folders/FOLDER_ID_HERE', 'reset');

logStep('2', 'Google Apps Script Setup');
log('   • Go to [script.google.com](https://script.google.com)', 'reset');
log('   • Create a new project named "QR Visitor Management System"', 'reset');
log('   • Replace the default code with the content from:', 'reset');
log('     src/backend/google-apps-script.js', 'yellow');

logStep('3', 'Configuration Update');
log('   • In the Google Apps Script, update the CONFIG object:', 'reset');
log('   • Replace YOUR_DRIVE_FOLDER_ID_HERE with your actual folder ID', 'reset');
log('   • Update admin credentials if needed', 'reset');

logStep('4', 'Deploy as Web App');
log('   • Click "Deploy" → "New deployment"', 'reset');
log('   • Choose "Web app" type', 'reset');
log('   • Set "Execute as" to "Me"', 'reset');
log('   • Set "Who has access" to "Anyone" or "Anyone with Google Account"', 'reset');
log('   • Click "Deploy" and authorize when prompted', 'reset');
log('   • Copy the Web app URL (you will need this)', 'reset');

logStep('5', 'Frontend Configuration');
log('   • Edit src/js/config.js', 'reset');
log('   • Replace YOUR_GOOGLE_APPS_SCRIPT_URL_HERE with your Web app URL', 'reset');

logStep('6', 'Test the Integration');
log('   • In Google Apps Script, run the setupDriveFolder() function', 'reset');
log('   • Run the testConnection() function to verify setup', 'reset');
log('   • Check the logs for any errors', 'reset');

logStep('7', 'Verify Setup');
log('   • Check your Google Drive folder for new spreadsheets', 'reset');
log('   • Test form submission from your application', 'reset');
log('   • Verify data appears in the spreadsheets', 'reset');

log('\n📋 Required Information:', 'bright');
log('   • Google Drive Folder ID', 'reset');
log('   • Google Apps Script Web App URL', 'reset');
log('   • Admin credentials (if customizing)', 'reset');

log('\n🔗 Useful Links:', 'bright');
log('   • Google Drive: https://drive.google.com', 'reset');
log('   • Google Apps Script: https://script.google.com', 'reset');
log('   • Setup Guide: GOOGLE_SHEETS_SETUP.md', 'reset');

log('\n⚠️  Important Notes:', 'yellow');
log('   • Keep your folder ID and Web app URL secure', 'reset');
log('   • Monitor API usage quotas', 'reset');
log('   • Test thoroughly before production use', 'reset');
log('   • Regular backups are automatic with Google Drive', 'reset');

log('\n🎯 Next Steps:', 'bright');
log('   1. Complete the setup steps above', 'reset');
log('   2. Test with sample data', 'reset');
log('   3. Customize validation rules if needed', 'reset');
log('   4. Deploy to production', 'reset');

log('\n📚 For detailed instructions, see: GOOGLE_SHEETS_SETUP.md', 'cyan');
log('\n🎉 Happy coding! 🚀', 'green');
