# QR Visitor Management System

A modern web application for managing visitor entries and parking permits using QR codes and Google Sheets integration.

---

## 🚀 Features

- **Visitor Registration:** Simple and secure visitor entry forms with real-time validation
- **Parking Permit Management:** Vehicle registration system with 1-hour parking limit
- **QR Code Integration:** Generate QR codes for tracking and access
- **Google Sheets Integration:** Automatic data storage and retrieval
- **Responsive Design:** Works across all modern devices
- **Admin Dashboard:** View, manage, and analyze all data
- **Security:** Rate limiting, CORS protection, secure headers

---

## 🏗️ Project Structure

```text
qr-visitor-management-system/
├── src/
│   ├── pages/           # HTML pages (index, visitor, parking, admin)
│   ├── css/             # Stylesheets
│   ├── js/              # Frontend JS
│   └── backend/         # Google Apps Script integration
├── scripts/             # Setup and utility scripts
├── server.js            # Express.js backend
├── package.json         # Dependencies
└── README.md            # Project documentation
```

---

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js
- **Frontend:** HTML, CSS, JavaScript
- **Database:** Google Sheets (via Apps Script)
- **Security:** Helmet.js, CORS, Rate Limiting
- **Dev Tools:** Nodemon, Browser-sync, ESLint, Prettier

---

## 📋 Prerequisites

- Node.js >= 16.x
- npm >= 8.x
- Google account (for Sheets integration)
- Modern web browser

---

## 🚦 Quick Start

1. **Clone the repository**
    ```bash
    git clone https://github.com/Aanand058/qr-visitor-management-system.git
    cd qr-visitor-management-system
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Run setup script**
    ```bash
    npm run setup
    ```
    This will create a `.env` file and required directories.

4. **Configure Google Apps Script**
    - Create a new Apps Script project.
    - Copy code from `src/backend/google-apps-script.js`.
    - Deploy as a web app.
    - Update `GOOGLE_SCRIPT_URL` in `.env`.

5. **Start the application**
    ```bash
    npm start
    ```
    Runs at `http://localhost:3000`.

---

## 🔧 Configuration

- Create a `.env` file with the following:
    ```env
    PORT=3000
    NODE_ENV=development

    GOOGLE_SCRIPT_URL=YOUR_GOOGLE_APPS_SCRIPT_URL_HERE

    VISITORS_SHEET_ID=YOUR_VISITORS_SHEET_ID_HERE
    PARKING_SHEET_ID=YOUR_PARKING_SHEET_ID_HERE

    SESSION_SECRET=your_session_secret_here
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=your_secure_password_here
    ```

---

## 📑 Usage

### Visitor Registration
- Go to the main page > Visitor Entry.
- Fill out all required fields and submit.

### Parking Permit
- Go to the main page > Parking Permit.
- Fill out visitor and vehicle details (Make, Model, Color, License Plate).
- **Note:** Parking is limited to 1 hour.

---

## 🔌 API Endpoints

| Method | Endpoint        | Description                   |
|--------|----------------|-------------------------------|
| GET    | /              | Main application page         |
| GET    | /visitor       | Visitor registration page     |
| GET    | /parking       | Parking permit page           |
| GET    | /admin         | Admin dashboard               |
| GET    | /health        | Health check                  |
| POST   | /api/submit    | Submit visitor/parking data   |
| GET    | /api/visitors  | Retrieve visitor data         |
| GET    | /api/parking   | Retrieve parking data         |

---

## 🖌️ Customization

- Styles: `src/css/` (main, forms, dialog, dashboard)
- Frontend logic: `src/js/app.js`
- Backend: `server.js`
- Google Apps Script: `src/backend/google-apps-script.js`

---

## 📊 Data Structure

**Visitor Entry**
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

**Parking Permit**
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

---

## 🚀 Deployment

- **Development Mode**
    ```bash
    npm run dev
    ```
- **Production Mode**
    ```bash
    npm start
    ```
- **Generate QR Codes**
    ```bash
    npm run generate-qr -- --url https://yourdomain.com
    ```

---

## 🔒 Security Features

- Rate limiting and abuse prevention
- CORS protection and secure headers
- Input validation (client & server)
- Secure environment variable management

---

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start dev server with auto-reload
- `npm run setup` - Initial setup
- `npm run generate-qr` - QR code generation
- `npm run setup-google-sheets` - Sheets integration

---

## 🐛 Troubleshooting

- **Port In Use:** Change port in `.env` or kill process:  
  ```bash
  lsof -ti:3000 | xargs kill -9
  ```
- **Apps Script Errors:** Check URL, permissions & logs
- **Form Issues:** Check browser console & server logs

Health check: `http://localhost:3000/health`

---

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a pull request

---

## 🙏 Acknowledgments

- Express.js community
- Google Apps Script
- Modern CSS & JavaScript standards

---

## 📞 Support

- Create an issue in this repo
- See [SETUP.md](SETUP.md) for more setup details
- Review console logs and server output

---

**Made with ❤️ for efficient visitor management**