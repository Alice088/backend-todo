import express from 'express';
import { connection } from "./db.js"
const app = express();

app.get('/', (req, res) => {
    res.send('Choo Choo! Welcome to your Express app 🚅');
})

app.get("/json", (req, res) => {
    res.json({"Choo Choo": "Welcome to your Express app 🚅"});
})

const port = process.env.PORT || 3000;

connection.connect(err => {
    if (err) console.log("no connect", err);
    else console.log("Successfully connected to the database.");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})