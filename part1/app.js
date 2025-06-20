import express from 'express';
import {getDogs} from './db.js';

const app = express();

app.get("/api/dogs", (req, res) => {
    const dogs = await getDogs()
    res.send(dogs);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
