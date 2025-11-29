# CleanCoast – Beach Cleanup Platform

A comprehensive full-stack platform that connects environmental volunteers with local beach cleanup initiatives, featuring real-time collaboration tools, geolocation-based notifications, and seamless event management to make coastal conservation more accessible and impactful.

## 🚀 Features

### Core Functionality
- **Event Discovery** – Browse and search for beach cleanup events in your area
- **User Registration & Management** – Complete user profile system with volunteer tracking
- **Event Participation** – Easy registration and check-in system for cleanup initiatives
- **Event Creation** – Organizers can create and manage cleanup events with details, dates, and locations

### Advanced Features
- **Google OAuth 2.0 Integration** – Secure and seamless authentication providing:
  - One-click sign-in/sign-up
  - Improved user onboarding experience
  - Enhanced account security
  
- **Real-Time Group Chat** – WebSocket-based communication system featuring:
  - Live messaging for volunteer coordination
  - Event-specific chat rooms
  - Instant notifications for new messages
  - Online user presence indicators
  
- **Geolocation-Based Notifications** – Smart email alert system that:
  - Automatically detects nearby cleanup events
  - Sends personalized notifications based on user location
  - Customizable notification preferences
  - Event reminders and updates

## 🛠️ Tech Stack

### Frontend
- **React** – Dynamic and responsive user interface
- **React Router** – Client-side routing
- **Axios** – HTTP client for API requests
- **Socket.io Client** – Real-time bidirectional communication

### Backend
- **Node.js** – Server-side JavaScript runtime
- **Express** – Web application framework
- **MongoDB** – NoSQL database for flexible data storage
- **Mongoose** – MongoDB object modeling

### Real-Time Communication
- **Socket.io** – WebSocket library for real-time chat functionality

### Authentication
- **Google OAuth 2.0** – Secure third-party authentication
- **JWT (JSON Web Tokens)** – Session management

### Geolocation & Notifications
- **Nodemailer** – Email notification system
- **Geolocation API** – Location-based event matching

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)
- Google Cloud Console account (for OAuth credentials)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cleancoast.git
cd cleancoast
```

2. **Install dependencies**

For backend:
```bash
cd backend
npm install
```

For frontend:
```bash
cd frontend
npm install
```

3. **Set up Google OAuth 2.0**

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable Google+ API
- Go to "Credentials" and create OAuth 2.0 Client ID
- Add authorized redirect URIs:
  - `http://localhost:3000` (for development)
  - Your production URL (for deployment)
- Copy the Client ID and Client Secret

4. **Set up environment variables**

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Frontend URL
CLIENT_URL=http://localhost:3000
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

5. **Set up MongoDB**

If using MongoDB locally:
```bash
# Start MongoDB service
mongod
```

Or use MongoDB Atlas for cloud database and update the `MONGODB_URI` in your `.env` file.

## 🚀 Running the Application

1. **Start MongoDB** (if using local instance)
```bash
mongod
```

2. **Start the backend server** (in a new terminal)
```bash
cd backend
npm start
```
The server will start on `http://localhost:5000`

3. **Start the frontend development server** (in another terminal)
```bash
cd frontend
npm start
```
The app will open at `http://localhost:3000`

**Important:** Both backend and frontend servers must be running simultaneously for the application to work properly, especially for real-time chat features.

## 📱 Usage

### For Volunteers
1. Sign in using Google OAuth for quick access
2. Set your location preferences for personalized event notifications
3. Browse nearby beach cleanup events
4. Register for events you want to participate in
5. Join event-specific chat rooms to coordinate with other volunteers
6. Receive email notifications about upcoming events in your area

### For Organizers
1. Create an account and verify as an organizer
2. Create new beach cleanup events with:
   - Location details and map integration
   - Date and time information
   - Expected number of volunteers
   - Required materials and instructions
3. Manage event registrations
4. Communicate with volunteers through real-time chat
5. Send updates and reminders to registered volunteers

## 💬 Real-Time Chat Features

The WebSocket-based chat system provides:
- Event-specific chat rooms for focused discussions
- Real-time message delivery with Socket.io
- Typing indicators
- Message history persistence
- Online/offline status indicators
- Instant notifications for new messages

## 📍 Geolocation Features

The location-based notification system includes:
- Automatic detection of user location
- Distance-based event filtering
- Customizable radius for event notifications
- Email alerts for events within specified range
- Privacy-conscious location handling

## 🔐 Security Features

- Google OAuth 2.0 secure authentication
- JWT-based session management
- Protected API endpoints with middleware
- Input validation and sanitization
- Secure WebSocket connections
- Environment variable protection

## 📂 Project Structure

```
cleancoast/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── utils/
│   └── public/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   │   ├── emailService.js
│   │   └── socketService.js
│   └── utils/
└── README.md
```

## 🌐 API Endpoints

### Authentication
- `POST /auth/google` - Google OAuth login
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - User logout

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/register-event/:eventId` - Register for event

### Chat
- WebSocket connection on `/socket.io`
- Events: `join_room`, `send_message`, `typing`, `user_online`

## 👥 Authors

- Rahul Raut - [GitHub Profile](https://github.com/rahulraut1220)

## 🌊 Making an Impact

CleanCoast is more than just a platform—it's a movement. Every cleanup event registered, every volunteer connected, and every beach restored contributes to healthier oceans and cleaner coastlines for future generations.

---
