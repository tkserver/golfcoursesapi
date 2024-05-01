const express = require('express');
require('dotenv').config();
const app = express();
const userRoutes = require('./routes/users');
const coursesRoutes = require('./routes/courses'); // Adjust the path as necessary

app.use(express.json()); // Middleware for parsing application/json

app.use('/users', userRoutes); // Example user routes

// Other imports...

// Middleware setup...
app.use('/courses', coursesRoutes); // Using the courses route

module.exports = app;
