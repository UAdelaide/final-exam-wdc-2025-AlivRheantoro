const express = require('express');
const app = express();

app.use(express.json());

const apiRoutes = require('./routes/api');
const StartupDatabase = require('./StartupData');

app.get('/', (req, res) => {
    res.send('Check Insomnia GET for API response');
});

StartupDatabase();
app.use('/api', apiRoutes);

const PORT = 3000;


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
