# Smart Assignment Tracker

A college academic management platform designed for students, teachers, and administrators to streamline coursework planning, track deadlines, and improve overall academic performance.

---

## 📌 Project Description

**Smart Assignment Tracker** bridges the communication and coordination gap between students, educators, and institutional leadership. It provides a centralized, transparent hub for tracking academic milestones, managing assignment schedules, and monitoring coursework progress across departments.

> **Current Milestone:** Section 01 - Project Setup & Foundation Architecture.

---

## 🛠️ Technology Stack

### Frontend
- **Framework / Runtime:** React 19, Vite
- **Language:** JavaScript (ESNext)
- **Styling:** Tailwind CSS (v4)
- **Routing:** React Router (v7)
- **HTTP Client:** Axios
- **Iconography:** Lucide React
- **Typography:** Plus Jakarta Sans

### Backend
- **Platform:** Node.js (v24+)
- **Server Framework:** Express.js
- **Database ORM:** Mongoose (v8+)
- **Cross-Origin Security:** CORS
- **Configuration:** Dotenv

### Database
- **Engine:** MongoDB

---

## 📁 Project Structure

```text
smart-assignment-tracker/
│
├── client/                      # Frontend React + Vite application
│   ├── public/                  # Static assets and icons
│   ├── src/
│   │   ├── assets/              # Component images & graphics
│   │   ├── components/          # Reusable UI components (ErrorBoundary, ApiHealthBadge)
│   │   ├── context/             # Global React Context providers (placeholders for auth/state)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── layouts/             # Page layouts (BaseLayout with Navbar & Footer)
│   │   ├── pages/               # Views (LandingPage, LoginPage, RegisterPage, NotFoundPage)
│   │   ├── services/            # API client services (Axios instance)
│   │   ├── utils/               # Helper utilities and formatting functions
│   │   ├── App.jsx              # Client router configuration
│   │   ├── index.css            # Global CSS & Tailwind configuration
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html               # Frontend HTML root
│   ├── package.json             # Frontend dependencies & scripts
│   └── vite.config.js           # Vite build and proxy settings
│
├── server/                      # Backend Node.js + Express API
│   ├── config/                  # Database and external service configurations (db.js)
│   ├── controllers/             # Request handlers for future feature modules
│   ├── middleware/              # Reusable middleware (errorMiddleware.js)
│   ├── models/                  # Mongoose data schemas
│   ├── routes/                  # Express route declarations (healthRoutes.js)
│   ├── services/                # Business logic services
│   ├── utils/                   # Server utility functions
│   ├── package.json             # Backend dependencies & scripts
│   └── server.js                # Server entry point
│
├── .gitignore                   # Repository git ignore rules
├── .env.example                 # Global environment variables template
└── README.md                    # Project documentation
```

---

## ⚙️ Environment Variables

A `.env.example` template is provided in the root directory. Copy it to `server/.env` to configure your backend environment:

```text
PORT=5000
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
AI_API_KEY=
```

### Key Variables:
- `PORT`: Port on which the Express server listens (default: `5000`).
- `MONGO_URI`: MongoDB connection string (e.g. `mongodb://localhost:27017/smart-assignment-tracker` or MongoDB Atlas URI).
- `JWT_SECRET`: Secret key for JWT authentication tokens (for subsequent auth phases).
- `CLOUDINARY_*`: Cloudinary credentials for assignment attachment storage.
- `AI_API_KEY`: API key for automated assignment assistance and plagiarism analysis.

> **Security Notice:** Do not commit actual `.env` files with secret keys into version control.

---

## 🚀 Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended; verified with v24)
- [npm](https://www.npmjs.com/) (version 9 or higher)
- Optional: [MongoDB](https://www.mongodb.com/) running locally or a free MongoDB Atlas cluster

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd smart-assignment-tracker
```

### 2. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Create your environment configuration file:
   ```bash
   cp ../.env.example .env
   ```
   *(On Windows PowerShell, use `copy ..\.env.example .env`)*

4. Update `server/.env` with your desired `PORT` (e.g., `5000`) and optional `MONGO_URI`.

### 3. Frontend Setup
1. Open a second terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```

---

## 💻 How to Start the Application

### Starting the Backend Server
From the `server` directory:
```bash
# Start with hot-reload (development mode):
npm run dev

# Or start directly with node:
npm start
```
The API will be operational at:
- **Server:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`

### Starting the Frontend Client
From the `client` directory:
```bash
# Start Vite development server:
npm run dev
```
The client will be running at:
- **Client Application:** `http://localhost:5173`

*(The client development server includes an automatic proxy forwarding `/api` calls to `http://localhost:5000`.)*

---

## 🔍 Verification & Health Check

1. **Verify Backend Status**:
   Visit `http://localhost:5000/api/health` in your browser or run:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected response:
   ```json
   {
     "success": true,
     "message": "Smart Assignment Tracker API is running"
   }
   ```

2. **Verify Frontend UI**:
   Visit `http://localhost:5173`. Check the footer badge: it will display a live green indicator reading **Backend Operational** when the server is online.

3. **Verify Database Behavior**:
   If no `MONGO_URI` is provided or if MongoDB is unreachable, the server logs a clear, graceful warning without crashing the process.
