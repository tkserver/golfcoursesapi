const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware for parsing application/json
app.use(express.json());

const allowedOrigins = ['https://www.utahgolfguru.com', 'http://localhost:3000', 'https://api.utahgolfguru.com'];

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin - like mobile apps or curl requests
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
}));

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).send('Internal Server Error');
});

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
