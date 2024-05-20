const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerUser, findUserByUsername } = require('../db/index');
require('dotenv').config();
const rateLimiter = require('../middleware/rateLimiter'); // Import the rate limiter

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    registerUser(username, hashedPassword, (err, results) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).send('Error registering user');
      }
      res.status(201).send('User registered successfully');
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Error registering user');
  }
});

// Login a user and issue a JWT token
router.post('/login', rateLimiter, async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Login request received:', username);
    findUserByUsername(username, async (err, user) => {
      if (err) {
        console.error('Error finding user:', err);
        return res.status(500).send('Internal server error');
      }
      if (!user) {
        console.error('User not found:', username);
        return res.status(401).send('Invalid username or password');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.error('Invalid password for user:', username);
        return res.status(401).send('Invalid username or password');
      }

      const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
      res.json({ accessToken });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
