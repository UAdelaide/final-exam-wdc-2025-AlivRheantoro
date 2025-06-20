// app.js
const express = require('express');
const apiRoutes = require('./routes/api');
const StartupDatabase = require('./StartupData');
StartupDatabase();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Check Insomnia GET for API response');
});

const PORT = 3000;

(async () => {
  try {
    await StartupDatabase();
    app.use('/api', apiRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
})();
