const express = require('express');
const router = express.Router();

// Example route: GET /users
router.get('/', (req, res) => {
  res.send('Users endpoint');
});

module.exports = router;
