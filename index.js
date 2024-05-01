const express = require('express');
const app = express();
const PORT = 3001; // Use a different port if your React app will run on 3000

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
