// app.js
const express = require('express');
const apiRoutes = require('./routes/api');
const StartupDatabase = require('./StartupData');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Check Insomnia GET for API response');
});

// Start the server only after DB is ready
const PORT = 3000;

(async () => {
  try {
    await StartupDatabase(); // wait for DB setup
    app.use('/api', apiRoutes); // register routes after DB is ready

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
})();
