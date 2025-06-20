const express = require('express');
const app = express();

const apiRoutes = require('./routes/api');
const seedDatabase = require('./StartupData');

app.use(express.json());
seedDatabase();
app.use('/api', apiRoutes);

const PORT = 3000;
app.get('/', (req, res) => {
    res.send('Check Insomnia GET for API response');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
