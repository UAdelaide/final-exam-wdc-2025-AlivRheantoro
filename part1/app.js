import express from 'express';

const app = express();

app.get("/api/dogs", (req, res) => {
    res.send("woof");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen, (8080, ()
    console.log('')
}