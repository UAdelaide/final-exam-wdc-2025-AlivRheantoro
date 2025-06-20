import express from 'express';

const app = express();

app.get("/api/

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!');
});
