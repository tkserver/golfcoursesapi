// Import necessary modules
const express = require('express');
require('dotenv').config();

// Initialize the Express application
const app = express();

// Middleware for parsing application/json
app.use(express.json());

// Routes setup
const userRoutes = require('./routes/users');
const coursesRoutes = require('./routes/courses'); // Adjust the path as necessary

// Create a new router for the /api route
const apiRouter = express.Router();

// Apply user and courses routes
app.use('/users', userRoutes);
app.use('/courses', coursesRoutes);

// Apply the /api router to the app
app.use('/api', apiRouter);

// Root route
// app.get('/', (req, res) => {
//     res.send('Hello from the backend!');
// });

// Determine the port to listen on
const port = process.env.PORT || 3001;

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Optionally, if you're exporting this for further usage, such as testing:
module.exports = app;