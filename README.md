# QR Visitor Management System

A comprehensive, modern web application for managing visitor entries and parking permits using QR codes and Google Sheets integration.

## 🚀 Features

- **Visitor Registration**: Streamlined visitor entry forms with real-time validation
- **Parking Permit Management**: Complete vehicle registration system with 1-hour parking limit
- **QR Code Integration**: Generate QR codes for easy access and tracking
- **Google Sheets Integration**: Automatic data storage and management
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Real-time Validation**: Form validation and error handling
- **Security Features**: Rate limiting, CORS protection, and security headers
- **Admin Dashboard**: Comprehensive data management and analytics

## 🏗️ Architecture

```
qr-visitor-management-system/
├── src/
│   ├── pages/           # HTML pages (index, visitor, parking, admin)
│   ├── css/             # Stylesheets (main, forms, dialog, dashboard)
│   ├── js/              # Frontend JavaScript (app, dashboard, dialog)
│   └── backend/         # Google Apps Script integration
├── scripts/             # Setup and utility scripts
├── server.js            # Express.js server
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Google Sheets (via Google Apps Script)
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: Nodemon, Browser-sync, ESLint, Prettier

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Google account (for Google Sheets integration)
- Modern web browser

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/qr-visitor-management-system.git
cd qr-visitor-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
npm run setup
```
This will create a `.env` file and necessary directories.

### 4. Configure Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Copy the code from `src/backend/google-apps-script.js`
4. Deploy as a web app
5. Update `GOOGLE_SCRIPT_URL` in your `.env` file

### 5. Start the Application
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Google Apps Script Configuration
GOOGLE_SCRIPT_URL=YOUR_GOOGLE_APPS_SCRIPT_URL_HERE

# Google Sheets IDs
VISITORS_SHEET_ID=YOUR_VISITORS_SHEET_ID_HERE
PARKING_SHEET_ID=YOUR_PARKING_SHEET_ID_HERE

# Security Configuration
SESSION_SECRET=your_session_secret_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

### Google Sheets Setup
1. Create two Google Sheets:
   - **Visitors Sheet**: For visitor registration data
   - **Parking Sheet**: For parking permit data
2. Update the sheet IDs in your `.env` file
3. Run the setup function in Google Apps Script

## 📱 Usage

### Visitor Registration
1. Navigate to the main page
2. Click "Visitor Entry"
3. Fill in the required fields:
   - Visitor Name
   - Resident Name
   - Unit Number
   - Phone Number
4. Submit the form

### Parking Permit
1. Navigate to the main page
2. Click "Parking Permit"
3. Fill in the required fields:
   - Visitor Name
   - Resident Name
   - Unit Number
   - Vehicle Details (Make, Model, Color, License Plate)
4. Submit the form

**Note**: Parking is limited to 1 hour only. Overnight parking is not permitted.

## 🔌 API Endpoints

### Core Endpoints
- `GET /` - Main application page
- `GET /visitor` - Visitor registration page
- `GET /parking` - Parking permit page
- `GET /admin` - Admin dashboard
- `GET /health` - Health check endpoint

### API Endpoints
- `POST /api/submit` - Submit visitor or parking data
- `GET /api/visitors` - Retrieve visitor data
- `GET /api/parking` - Retrieve parking data

## 🎨 Customization

### Styling
- Modify `src/css/main.css` for global styles
- Update `src/css/forms.css` for form-specific styling
- Customize `src/css/dialog.css` for modal dialogs
- Adjust `src/css/dashboard.css` for admin interface

### Functionality
- Edit `src/js/app.js` for frontend logic
- Modify `server.js` for backend functionality
- Update Google Apps Script for data processing

## 📊 Data Structure

### Visitor Entry
```json
{
  "type": "Visitor",
  "name": "John Doe",
  "residentName": "Jane Smith",
  "unitNo": "A1",
  "phone": "+1 234-567-8900",
  "visitDate": "12/25/2024",
  "visitTime": "2:30:45 PM"
}
```

### Parking Permit
```json
{
  "type": "Parking",
  "visitorName": "John Doe",
  "residentName": "Jane Smith",
  "unitNo": "A1",
  "carMake": "Toyota",
  "carModel": "Corolla",
  "carColor": "Red",
  "licensePlate": "ABC123",
  "visitDate": "12/25/2024",
  "visitTime": "2:30:45 PM"
}
```

## 🚀 Deployment

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Generate QR Codes
```bash
npm run generate-qr -- --url https://yourdomain.com
```

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: Server-side and client-side validation
- **Environment Variables**: Secure configuration management

## 📝 Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm run setup` - Run initial setup and configuration
- `npm run generate-qr` - Generate QR codes for deployment
- `npm run setup-google-sheets` - Configure Google Sheets integration

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change port in .env file or kill existing process
   lsof -ti:3000 | xargs kill -9
   ```

2. **Google Apps Script Errors**
   - Verify the script URL is correct
   - Check Google Apps Script logs
   - Ensure proper deployment permissions

3. **Form Submission Issues**
   - Check browser console for errors
   - Verify network connectivity
   - Check server logs

### Health Check
Visit `http://localhost:3000/health` to verify server status.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js community for the robust web framework
- Google Apps Script for seamless integration
- Modern CSS and JavaScript standards for responsive design

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [SETUP.md](SETUP.md) file for detailed setup instructions
- Review the console logs and server output

---

**Made with ❤️ for efficient visitor management**
