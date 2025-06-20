const express = require('express');
const app = express();
const port = 3000;

const db = require('./db');
const insertSeedData = require('./StartupData');

// Insert data on startup
insertSeedData();

// Routes
app.use('/api', require('./routes/dogs'));
app.use('/api', require('./routes/walkrequests'));
app.use('/api', require('./routes/walkers'));

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
