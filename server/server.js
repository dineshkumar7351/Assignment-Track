const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const similarityRoutes = require('./routes/similarityRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from server/.env and root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware: Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors());

// Middleware: Body parser for incoming JSON payloads
app.use(express.json());

// Middleware: Body parser for URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Middleware: Ensure MongoDB is connected for every serverless function request
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    console.error('[DB Middleware Error]:', e.message);
  }
  next();
});

// Mount API Routes helper for standard and serverless rewritten path matching
const mountRoutes = (prefix) => {
  app.use(`${prefix}/health`, healthRoutes);
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/dashboard`, dashboardRoutes);
  app.use(`${prefix}/assignments`, assignmentRoutes);
  app.use(`${prefix}/subjects`, subjectRoutes);
  app.use(`${prefix}/submissions`, submissionRoutes);
  app.use(`${prefix}/evaluations`, evaluationRoutes);
  app.use(`${prefix}/similarity`, similarityRoutes);
  app.use(`${prefix}/notifications`, notificationRoutes);
  app.use(`${prefix}/calendar`, calendarRoutes);
  app.use(`${prefix}/analytics`, analyticsRoutes);
  app.use(`${prefix}/ai`, aiRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
};

mountRoutes('/api');
mountRoutes('');

const fs = require('fs');

// Static uploads directory for locally uploaded student deliverables
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static client build if present (production / deployment)
const clientDistPath = path.join(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/auth')) {
      return next();
    }
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
} else {
  // Root route API description
  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Smart Assignment Tracker API is operational',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        dashboard: '/api/dashboard',
        assignments: '/api/assignments',
        subjects: '/api/subjects',
        submissions: '/api/submissions',
        evaluations: '/api/evaluations',
        similarity: '/api/similarity',
        notifications: '/api/notifications',
        calendar: '/api/calendar',
      },
    });
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
