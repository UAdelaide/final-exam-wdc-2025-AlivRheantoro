const express = require('express');
const app = express();

app.use(express.json());

const apiRoutes = require('./routes/api');
const StartupDatabase = require('./StartupData');


StartupDatabase();
app.use('/api', apiRoutes);

const PORT = 3000;


app.get('/', (req, res) => {
    res.send('Check Insomnia GET for API response');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
