import express from 'express';
import {
  initDatabase,
  getDogs,
  getAPIDogs,
  getAPIWalkReqsOpen,
  getAPIWalkerSummary
} from './db.js';


await initDatabase();

const app = express();


app.get("/api/dogs", async (req, res) => {
  try {
    const dogs = await getAPIDogs();
    res.json(dogs);
  } catch (err) {
    res.status(500).send('Failed to fetch dogs');
  }
});

app.get("/api/walkrequests/open", async (req, res) => {
  const openRequests = await getAPIWalkReqsOpen();
  res.json(openRequests);
});


app.get("/api/walkers/summary", async (req, res) => {
  const summary = await getAPIWalkerSummary();
  res.json(summary);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
