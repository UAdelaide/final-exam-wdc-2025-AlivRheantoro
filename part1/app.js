const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');
const seedDatabase = require('./Startup');

app.use(express.json());

// Seed data on startup
seedDatabase();

// Routes
app.use('/api', apiRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
