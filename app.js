const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware for parsing application/json
app.use(express.json());
app.use(cors()); // Enable CORS

// Routes setup
const userRoutes = require('./routes/users');
const coursesRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');

// Apply user, courses, and auth routes
app.use('/users', userRoutes);
app.use('/courses', coursesRoutes);
app.use('/auth', authRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
