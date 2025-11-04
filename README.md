"# Nexagen - Meeting Scheduling & Video Conferencing Platform

<div align="center">

![Nexagen Logo](https://img.shields.io/badge/Nexagen-Meeting%20Platform-blue?style=for-the-badge)

A professional, full-stack meeting scheduling and video conferencing platform with real-time communication, role-based access control, and integrated WebRTC video calling.

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.18-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?logo=socket.io)](https://socket.io/)
[![WebRTC](https://img.shields.io/badge/WebRTC-Enabled-333333?logo=webrtc)](https://webrtc.org/)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Functionality

#### **Three User Roles**
- **User (Guest)**: Book meetings, join video calls, manage bookings
- **Host**: Create availability slots, confirm/reject bookings, host meetings
- **Admin**: System-wide dashboard, user management, platform statistics

#### **Meeting Scheduling**
- ✅ Browse host availability with time slots
- ✅ Book meetings with guest information (name, email, phone)
- ✅ Real-time booking status updates (Pending, Confirmed, Rejected, Cancelled)
- ✅ Automatic meeting room generation on confirmation
- ✅ Buffer time support (before/after meeting)
- ✅ Access window enforcement (early join prevention + auto-disconnect)
- ✅ Email notifications for booking confirmations and reminders

#### **Video Conferencing**
- 🎥 **WebRTC P2P video calls** with simple-peer
- 🎤 Real-time camera/microphone toggle controls
- 👥 Dynamic participant display (host & guest names)
- 📱 Mobile-responsive video layout (4:3 mobile, 16:9 desktop)
- 🚪 Leave call functionality with proper cleanup
- ⏱️ Scheduled meeting time enforcement (auto-end at scheduled time)
- 🔒 Secure meeting room access validation

#### **Real-Time Features**
- 🔄 Live dashboard updates via Socket.io
- 📊 Instant booking status changes
- 🔔 Real-time participant count in meetings
- ⚡ WebSocket-based signaling for video calls

#### **Authentication & Authorization**
- 🔐 JWT-based authentication
- 🌐 Google OAuth integration
- 🛡️ Role-based route protection
- 🔑 Secure password hashing with bcryptjs

---

## 🛠 Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.1 | UI framework |
| React Router | 7.9.4 | Client-side routing |
| Tailwind CSS | 4.1.13 | Styling & responsive design |
| Axios | 1.12.2 | HTTP client |
| Socket.io Client | 4.8.1 | Real-time communication |
| simple-peer | 9.11.1 | WebRTC peer connections |
| @react-oauth/google | 0.12.2 | Google authentication |
| Heroicons | 2.2.0 | Icon library |
| Vite | 6.3.0 | Build tool & dev server |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | LTS | Runtime environment |
| Express | 5.1.0 | Web framework |
| MongoDB | 8.18.1 (Mongoose) | Database |
| Socket.io | 4.8.1 | WebSocket server |
| JWT | 9.0.2 | Token-based auth |
| bcryptjs | 3.0.2 | Password hashing |
| Nodemailer | 7.0.10 | Email service |
| UUID | 13.0.0 | Unique ID generation |
| Google Auth Library | 10.4.1 | OAuth verification |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  User Pages  │  │  Host Pages  │  │ Admin Pages  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │              │
│  ┌──────▼─────────────────▼──────────────────▼───────┐     │
│  │           React Router (Protected Routes)         │     │
│  └──────┬─────────────────┬──────────────────┬───────┘     │
│         │                 │                  │              │
│  ┌──────▼─────┐    ┌──────▼─────┐    ┌──────▼─────┐       │
│  │   Axios    │    │ Socket.io  │    │  WebRTC    │       │
│  │  Instance  │    │   Client   │    │ (Peer-to-  │       │
│  │  (JWT)     │    │            │    │   Peer)    │       │
│  └──────┬─────┘    └──────┬─────┘    └──────┬─────┘       │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │ HTTPS            │ WSS              │ P2P
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼─────────────┐
│                         SERVER                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Express.js (HTTPS)                     │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │    │
│  │  │   Auth   │  │   Host   │  │  Meeting │          │    │
│  │  │  Routes  │  │  Routes  │  │  Routes  │          │    │
│  │  └─────┬────┘  └─────┬────┘  └─────┬────┘          │    │
│  └────────┼─────────────┼─────────────┼────────────────┘    │
│           │             │             │                     │
│  ┌────────▼─────────────▼─────────────▼────────────────┐    │
│  │              Middleware Layer                       │    │
│  │     (JWT Verification, Role Checks)                 │    │
│  └────────┬─────────────┬─────────────┬────────────────┘    │
│           │             │             │                     │
│  ┌────────▼─────────────▼─────────────▼────────────────┐    │
│  │                Controllers                          │    │
│  └────────┬─────────────┬─────────────┬────────────────┘    │
│           │             │             │                     │
│  ┌────────▼─────────────▼─────────────▼────────────────┐    │
│  │            MongoDB (Mongoose ODM)                   │    │
│  │    ┌─────────┐  ┌──────────┐  ┌────────────┐       │    │
│  │    │  Users  │  │ Bookings │  │Availability│       │    │
│  │    └─────────┘  └──────────┘  └────────────┘       │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │          Socket.io Server (/meeting namespace)      │    │
│  │  • WebRTC Signaling (offer/answer/ice-candidate)    │    │
│  │  • Dashboard Updates (booking_status_updated)       │    │
│  │  • Room Management (join_host_room)                 │    │
│  └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### Prerequisites
- **Node.js** (v18+ LTS recommended)
- **MongoDB** (local or MongoDB Atlas)
- **Google Cloud Console** account (for OAuth)
- **Email SMTP credentials** (Gmail or other provider)

### Step 1: Clone the Repository
```bash
git clone https://github.com/ITZ-HURAIRAH18/Nexagen-Project.git
cd Nexagen-Project
```

### Step 2: Backend Setup
```bash
cd my-backend
npm install
```

Create `.env` file in `my-backend/`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/nexagen
# Or MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nexagen

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your_super_secret_jwt_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Frontend URL (for CORS)
FRONTEND_URL=https://localhost:5173
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env` file in `frontend/`:
```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# API Base URL (optional, auto-detects by default)
VITE_API_BASE=https://localhost:5000
```

### Step 4: SSL Certificates (for HTTPS)

**Option A: Development Certificates (Quick Start)**
The project uses `@vitejs/plugin-basic-ssl` for auto-generated certs. No setup needed.

**Option B: Trusted Local Certificates (Recommended for mobile testing)**
```bash
# Install mkcert
choco install mkcert  # Windows
brew install mkcert   # Mac
sudo apt install mkcert  # Linux

# Generate certificates
cd my-backend
mkcert localhost 127.0.0.1 192.168.10.7 ::1
# This creates: localhost+3.pem and localhost+3-key.pem

cd ../frontend
mkcert localhost 127.0.0.1 192.168.10.7 ::1
```

Update `server.js` and `vite.config.js` to use the new certificates if using mkcert.

---

## ⚙️ Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen
6. Add **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   https://localhost:5173
   https://192.168.10.7:5173  (your local network IP)
   ```
7. Add **Authorized redirect URIs**:
   ```
   http://localhost:5173
   https://localhost:5173
   ```
8. Copy **Client ID** to both `.env` files
9. Copy **Client Secret** to backend `.env`

### Email Configuration (Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Generate an **App Password**: Google Account → Security → App passwords
3. Use the 16-character password in `EMAIL_PASS`

---

## 🚀 Usage

### Development Mode

**Terminal 1 - Backend:**
```bash
cd my-backend
npm run dev
# Server runs on https://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on https://localhost:5173
```

### Production Build

**Backend:**
```bash
cd my-backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Accessing the Application

- **Local:** `https://localhost:5173`
- **Network (Mobile):** `https://192.168.10.7:5173` (replace with your IP)

### Default User Roles

After initial setup, register users with different roles:

1. **Admin Account**: Register first user, manually update role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Host Account**: Register with role selection during signup

3. **User Account**: Default role for new registrations

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Google OAuth Login
```http
POST /api/auth/google-login
Content-Type: application/json

{
  "credential": "google-jwt-token"
}
```

### Host Endpoints

#### Get Host Dashboard
```http
GET /api/host/dashboard
Authorization: Bearer <jwt-token>
```

#### Get Host Availability
```http
GET /api/host/availability
Authorization: Bearer <jwt-token>
```

#### Add Availability
```http
POST /api/host/availability
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "date": "2025-11-05",
  "slots": [
    { "startTime": "09:00", "endTime": "10:00" },
    { "startTime": "14:00", "endTime": "15:00" }
  ],
  "bufferBefore": 5,
  "bufferAfter": 5
}
```

#### Update Booking Status
```http
PUT /api/host/bookings/:id/status
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### User Endpoints

#### Browse Availability
```http
GET /api/user/availability?hostId=<host-id>&date=2025-11-05
Authorization: Bearer <jwt-token>
```

#### Book Meeting
```http
POST /api/user/book
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "hostId": "673a1234567890abcdef",
  "availabilityId": "673b9876543210fedcba",
  "slotId": "slot-uuid",
  "date": "2025-11-05",
  "startTime": "14:00",
  "endTime": "15:00",
  "guest": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890"
  }
}
```

#### Get User Bookings
```http
GET /api/user/bookings
Authorization: Bearer <jwt-token>
```

### Meeting Endpoints

#### Validate Meeting Room
```http
GET /api/meetings/:roomId
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "valid": true,
  "roomId": "550e8400-e29b-41d4-a716-446655440000",
  "bookingInfo": {
    "host": {
      "id": "673a1234567890abcdef",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "host"
    },
    "guest": {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+1234567890"
    },
    "start": "2025-11-05T14:00:00.000Z",
    "end": "2025-11-05T15:00:00.000Z",
    "accessStart": "2025-11-05T13:55:00.000Z",
    "accessEnd": "2025-11-05T15:05:00.000Z",
    "bufferBefore": 5,
    "bufferAfter": 5
  }
}
```

### Admin Endpoints

#### Get Admin Dashboard
```http
GET /api/admin/dashboard
Authorization: Bearer <jwt-token>
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <jwt-token>
```

#### Update User Role
```http
PUT /api/admin/users/:id/role
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "role": "host"
}
```

---

## 📁 Project Structure

```
Nexagen-Project/
├── frontend/                    # React frontend
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── api/                 # API configuration
│   │   │   └── axiosInstance.js # Axios with JWT interceptor
│   │   ├── assets/              # Images, fonts
│   │   ├── components/          # Reusable components
│   │   │   ├── AdminHeader.jsx
│   │   │   ├── HostHeader.jsx
│   │   │   ├── UserHeader.jsx
│   │   │   └── MeetingRoom.jsx  # WebRTC video component
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── pages/
│   │   │   ├── admin/           # Admin dashboards
│   │   │   ├── host/            # Host management pages
│   │   │   │   ├── HostDashboard.jsx
│   │   │   │   ├── ManageAvailability.jsx
│   │   │   │   ├── AddAvailability.jsx
│   │   │   │   ├── EditAvailability.jsx
│   │   │   │   ├── HostBookings.jsx
│   │   │   │   └── HostSettings.jsx
│   │   │   ├── user/            # User booking pages
│   │   │   │   ├── UserDashboard.jsx
│   │   │   │   ├── Availability.jsx
│   │   │   │   ├── BookingForm.jsx
│   │   │   │   └── Bookings.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── LoginRole.jsx
│   │   │   └── SignupRole.jsx
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx # Role-based routing
│   │   ├── utils/
│   │   │   └── apiConfig.js     # Dynamic API URL
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── vite.config.js           # Vite configuration
│
├── my-backend/                  # Node.js backend
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/             # Business logic
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── hostController.js
│   │   ├── meetingController.js # Meeting validation
│   │   └── userController.js
│   ├── emails/
│   │   └── templates.js         # Email HTML templates
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── models/                  # Mongoose schemas
│   │   ├── Availability.js
│   │   ├── Booking.js
│   │   └── User.js
│   ├── routes/                  # Express routes
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── hostRoutes.js
│   │   ├── meetingRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── nodemail.js          # Email service
│   ├── localhost.pem            # SSL certificate
│   ├── localhost-key.pem        # SSL private key
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Entry point
│
├── MOBILE_HTTPS_SETUP.md        # Mobile deployment guide
└── README.md                    # This file
```

---

## 🔒 Security

### Implemented Security Measures

1. **Authentication**
   - JWT tokens with 24h expiration
   - HTTP-only cookies (recommended for production)
   - bcryptjs password hashing (10 salt rounds)
   - Google OAuth with server-side token verification

2. **Authorization**
   - Role-based access control (RBAC)
   - Protected routes with middleware
   - User ownership validation for bookings

3. **Data Protection**
   - CORS configuration
   - HTTPS/TLS encryption
   - Environment variable isolation
   - Input validation and sanitization

4. **WebRTC Security**
   - Meeting room UUID generation
   - Time-based access windows
   - Scheduled meeting enforcement
   - Peer connection cleanup

### Security Best Practices

- ✅ Use strong JWT secrets (64+ characters)
- ✅ Enable HTTPS in production
- ✅ Implement rate limiting (consider `express-rate-limit`)
- ✅ Add Helmet.js for HTTP headers security
- ✅ Sanitize user inputs (consider `express-validator`)
- ✅ Monitor for suspicious activity
- ✅ Regular dependency updates (`npm audit`)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Join Button Disabled at Meeting Time**
**Symptom**: Host/user can't join meeting at scheduled time

**Solution**:
- Check server time synchronization
- Backend now allows 5-second grace period
- Frontend checks every 10 seconds (was 60s)
- Verify `accessStart` and `accessEnd` in database

```bash
# Check booking times in MongoDB
db.bookings.findOne({ meetingRoom: "room-id" })
```

#### 2. **Certificate Warnings on Mobile**
**Symptom**: "Not Secure" warning when accessing via network IP

**Solutions**:
- See `MOBILE_HTTPS_SETUP.md` for detailed guide
- Use mkcert for trusted local certificates
- Add network IP to OAuth authorized origins
- Manually accept certificates on device

#### 3. **Google OAuth Fails**
**Symptom**: "Error 400: redirect_uri_mismatch"

**Solution**:
- Add all URLs to Google Cloud Console:
  - `http://localhost:5173`
  - `https://localhost:5173`
  - `https://192.168.10.7:5173` (your IP)
- Wait 5-10 minutes for changes to propagate

#### 4. **WebRTC Video Not Working**
**Symptoms**: Black screen, no video feed

**Solutions**:
- Verify HTTPS is enabled (required for getUserMedia)
- Check browser camera/microphone permissions
- Test in different browser (Chrome/Firefox/Edge)
- Check firewall settings for WebRTC ports

```javascript
// Debug in browser console
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => console.log('✅ Media access granted'))
  .catch(err => console.error('❌ Media error:', err));
```

#### 5. **Socket.io Connection Fails**
**Symptom**: Dashboard not updating in real-time

**Solution**:
```javascript
// Check connection in browser console
socket.on('connect', () => console.log('✅ Connected:', socket.id));
socket.on('connect_error', (err) => console.error('❌ Socket error:', err));
```

- Verify backend is running on correct port
- Check CORS configuration in `server.js`
- Ensure `getSocketUrl()` returns correct URL

#### 6. **MongoDB Connection Error**
**Symptom**: `MongoServerError: Authentication failed`

**Solution**:
```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/nexagen"

# For Atlas:
mongosh "mongodb+srv://<username>:<password>@cluster.mongodb.net/nexagen"
```

- Verify `MONGO_URI` in `.env`
- Check MongoDB service is running
- For Atlas: Whitelist your IP address

#### 7. **Email Notifications Not Sending**
**Symptom**: Booking confirmations not received

**Solution**:
- Verify `EMAIL_USER` and `EMAIL_PASS` in `.env`
- Use App Password for Gmail (not regular password)
- Check spam folder
- Test email configuration:

```javascript
// In backend, run:
import { sendDirectEmail } from './utils/nodemail.js';
await sendDirectEmail('test@example.com', 'Test Subject', '<h1>Test</h1>');
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style (ESLint configured)
- Write meaningful commit messages
- Test features before submitting PR
- Update documentation for new features
- Maintain backwards compatibility

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Muhammad Abuhurairah**
- GitHub: [@ITZ-HURAIRAH18](https://github.com/ITZ-HURAIRAH18)
- Email: muhammadabuhurairah88@gmail.com

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Socket.io](https://socket.io/) - Real-time engine
- [simple-peer](https://github.com/feross/simple-peer) - WebRTC wrapper
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Heroicons](https://heroicons.com/) - Icon library

---

## 📊 Project Stats

- **Lines of Code**: ~15,000+
- **Components**: 25+
- **API Endpoints**: 30+
- **Models**: 3 (User, Booking, Availability)
- **Real-time Events**: 10+

---

## 🗺️ Roadmap

- [ ] **Meeting Recording** - Save and replay meetings
- [ ] **Screen Sharing** - Share host's screen
- [ ] **Chat Functionality** - In-meeting text chat
- [ ] **Multiple Participants** - Support 3+ users
- [ ] **Calendar Integration** - Google Calendar sync
- [ ] **Payment Integration** - Stripe for paid meetings
- [ ] **Mobile App** - React Native version
- [ ] **Meeting Analytics** - Duration, participation tracking
- [ ] **Waiting Room** - Host approval before joining
- [ ] **Virtual Backgrounds** - Custom video backgrounds

---

<div align="center">

**⭐ If you find this project helpful, please give it a star on GitHub! ⭐**

Made with ❤️ by Muhammad Abuhurairah

</div>" 
