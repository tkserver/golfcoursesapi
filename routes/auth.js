const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerUser, findUserByUsername } = require('../db/index');
require('dotenv').config();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    registerUser(username, hashedPassword, (err, results) => {
      if (err) {
        return res.status(500).send('Error registering user');
      }
      res.status(201).send('User registered successfully');
    });
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

// Login a user and issue a JWT token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Login request received for username: ", username);

  findUserByUsername(username, async (err, user) => {
    if (err) {
      console.error("Error finding user: ", err);
      return res.status(500).send('Error finding user');
    }
    if (!user) {
      console.log("User not found: ", username);
      return res.status(400).send('Cannot find user');
    }

    console.log("User found: ", user);

    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
        console.log("Password match, issuing token");
        res.json({ accessToken });
      } else {
        console.log("Password mismatch");
        res.status(403).send('User or password incorrect');
      }
    } catch (error) {
      console.error("Error during password comparison: ", error);
      res.status(500).send('Error logging in');
    }
  });
});

module.exports = router;
