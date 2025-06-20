import express from 'express';
import { initDatabase, getDogs, getAPIDogs, getAPIWalkReqsOpen} from './db.js';

await initDatabase();

const app = express();

app.get("dogs", async (req, res) => {
  try {
    const dogs = await getDogs();
    res.send(dogs);
  } catch (err) {
    res.status(500).send('Failed to fetch dogs');
  }
});

app.get("/api/dogs", async (req, res) => {
  try {
    const dogs = await getAPIDogs();
    res.send(dogs);
  } catch (err) {
    res.status(500).send('Failed to fetch dogs');
  }
});

app.get("/api/walkrequests/open", async (req, res) => {
  const openRequests = await getAPIWalkReqsOpen();
  res.json(openRequests);
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
