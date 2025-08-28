const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Your app URL - replace with your actual deployment URL
  APP_URL: 'http://localhost:3000', // Change this to your production URL
  
  // Output directory for QR codes
  OUTPUT_DIR: path.join(__dirname, '../public'),
  
  // QR code options
  QR_OPTIONS: {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    width: 512
  }
};

// Ensure output directory exists
function ensureOutputDir() {
  if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
    fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
    console.log(`✅ Created output directory: ${CONFIG.OUTPUT_DIR}`);
  }
}

// Generate QR code for the main app
async function generateMainQR() {
  try {
    const qrPath = path.join(CONFIG.OUTPUT_DIR, 'qr-code-main.png');
    
    await QRCode.toFile(qrPath, CONFIG.APP_URL, CONFIG.QR_OPTIONS);
    console.log(`✅ Main QR code generated: ${qrPath}`);
    
    return qrPath;
  } catch (error) {
    console.error('❌ Error generating main QR code:', error);
    throw error;
  }
}

// Generate QR code for visitor form
async function generateVisitorQR() {
  try {
    const visitorUrl = `${CONFIG.APP_URL}/#visitor`;
    const qrPath = path.join(CONFIG.OUTPUT_DIR, 'qr-code-visitor.png');
    
    await QRCode.toFile(qrPath, visitorUrl, CONFIG.QR_OPTIONS);
    console.log(`✅ Visitor QR code generated: ${qrPath}`);
    
    return qrPath;
  } catch (error) {
    console.error('❌ Error generating visitor QR code:', error);
    throw error;
  }
}

// Generate QR code for parking form
async function generateParkingQR() {
  try {
    const parkingUrl = `${CONFIG.APP_URL}/#parking`;
    const qrPath = path.join(CONFIG.OUTPUT_DIR, 'qr-code-parking.png');
    
    await QRCode.toFile(qrPath, parkingUrl, CONFIG.QR_OPTIONS);
    console.log(`✅ Parking QR code generated: ${qrPath}`);
    
    return qrPath;
  } catch (error) {
    console.error('❌ Error generating parking QR code:', error);
    throw error;
  }
}

// Generate QR code for admin panel
async function generateAdminQR() {
  try {
    const adminUrl = `${CONFIG.APP_URL}/admin`;
    const qrPath = path.join(CONFIG.OUTPUT_DIR, 'qr-code-admin.png');
    
    await QRCode.toFile(qrPath, adminUrl, CONFIG.QR_OPTIONS);
    console.log(`✅ Admin QR code generated: ${qrPath}`);
    
    return qrPath;
  } catch (error) {
    console.error('❌ Error generating admin QR code:', error);
    throw error;
  }
}

// Generate HTML page with all QR codes
async function generateQRPage() {
  try {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Codes - Visitor Management System</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .qr-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .qr-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .qr-card h3 {
            color: #333;
            margin-bottom: 15px;
        }
        .qr-card img {
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .qr-card p {
            color: #666;
            margin: 15px 0;
            font-size: 14px;
        }
        .download-btn {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-top: 10px;
        }
        .download-btn:hover {
            background: #0056b3;
        }
        .instructions {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .instructions h2 {
            color: #333;
            margin-bottom: 15px;
        }
        .instructions ul {
            color: #666;
            line-height: 1.6;
        }
        .instructions li {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 QR Codes Generated Successfully!</h1>
        <p>Your Visitor Management System QR Codes</p>
    </div>
    
    <div class="instructions">
        <h2>📋 How to Use These QR Codes</h2>
        <ul>
            <li><strong>Main QR Code:</strong> Scan to access the main landing page</li>
            <li><strong>Visitor QR Code:</strong> Scan to directly access visitor registration form</li>
            <li><strong>Parking QR Code:</strong> Scan to directly access parking permit form</li>
            <li><strong>Admin QR Code:</strong> Scan to access the admin dashboard (keep this secure!)</li>
        </ul>
        <p><strong>Note:</strong> Make sure to update the APP_URL in scripts/generateQR.js before generating QR codes for production.</p>
    </div>
    
    <div class="qr-grid">
        <div class="qr-card">
            <h3>🏠 Main Landing Page</h3>
            <img src="qr-code-main.png" alt="Main QR Code">
            <p>Scan to access the main visitor management system</p>
            <a href="qr-code-main.png" download class="download-btn">Download QR Code</a>
        </div>
        
        <div class="qr-card">
            <h3>👥 Visitor Registration</h3>
            <img src="qr-code-visitor.png" alt="Visitor QR Code">
            <p>Scan to directly access visitor registration form</p>
            <a href="qr-code-visitor.png" download class="download-btn">Download QR Code</a>
        </div>
        
        <div class="qr-card">
            <h3>🚗 Parking Permit</h3>
            <img src="qr-code-parking.png" alt="Parking QR Code">
            <p>Scan to directly access parking permit form</p>
            <a href="qr-code-parking.png" download class="download-btn">Download QR Code</a>
        </div>
        
        <div class="qr-card">
            <h3>🔐 Admin Dashboard</h3>
            <img src="qr-code-admin.png" alt="Admin QR Code">
            <p>Scan to access admin dashboard (keep secure!)</p>
            <a href="qr-code-admin.png" download class="download-btn">Download QR Code</a>
        </div>
    </div>
    
    <div class="instructions">
        <h2>🚀 Next Steps</h2>
        <ul>
            <li>Print these QR codes and place them in strategic locations</li>
            <li>Test each QR code to ensure they work correctly</li>
            <li>Update the APP_URL in the script if you deploy to production</li>
            <li>Consider laminating the QR codes for durability</li>
            <li>Set up your Google Sheets integration for data storage</li>
        </ul>
    </div>
</body>
</html>`;

    const htmlPath = path.join(CONFIG.OUTPUT_DIR, 'qr-codes.html');
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`✅ QR codes HTML page generated: ${htmlPath}`);
    
    return htmlPath;
  } catch (error) {
    console.error('❌ Error generating QR codes HTML page:', error);
    throw error;
  }
}

// Main function to generate all QR codes
async function generateAllQRCodes() {
  try {
    console.log('🚀 Starting QR code generation...\n');
    
    // Ensure output directory exists
    ensureOutputDir();
    
    // Generate all QR codes
    await generateMainQR();
    await generateVisitorQR();
    await generateParkingQR();
    await generateAdminQR();
    
    // Generate HTML page
    await generateQRPage();
    
    console.log('\n🎉 All QR codes generated successfully!');
    console.log(`📁 Check the '${CONFIG.OUTPUT_DIR}' directory for your QR codes.`);
    console.log(`🌐 Open 'qr-codes.html' in your browser to view all QR codes.`);
    
  } catch (error) {
    console.error('\n❌ Error generating QR codes:', error);
    process.exit(1);
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 QR Code Generator for Visitor Management System

Usage:
  node generateQR.js [options]

Options:
  --help, -h     Show this help message
  --url <url>    Set custom app URL (default: ${CONFIG.APP_URL})
  --output <dir> Set custom output directory (default: ${CONFIG.OUTPUT_DIR})

Examples:
  node generateQR.js
  node generateQR.js --url https://yourdomain.com
  node generateQR.js --output ./my-qr-codes

Note: Make sure to update the APP_URL in the script before generating production QR codes.
    `);
    process.exit(0);
  }
  
  // Parse custom URL if provided
  const urlIndex = args.indexOf('--url');
  if (urlIndex !== -1 && args[urlIndex + 1]) {
    CONFIG.APP_URL = args[urlIndex + 1];
    console.log(`🔗 Using custom URL: ${CONFIG.APP_URL}`);
  }
  
  // Parse custom output directory if provided
  const outputIndex = args.indexOf('--output');
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    CONFIG.OUTPUT_DIR = path.resolve(args[outputIndex + 1]);
    console.log(`📁 Using custom output directory: ${CONFIG.OUTPUT_DIR}`);
  }
  
  // Generate QR codes
  generateAllQRCodes();
}

module.exports = {
  generateAllQRCodes,
  generateMainQR,
  generateVisitorQR,
  generateParkingQR,
  generateAdminQR,
  CONFIG
};
