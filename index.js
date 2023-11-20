import express from 'express';
import { connection } from "./db.js"
const app = express();

app.get('/', (req, res) => {
    res.send('Choo Choo! Welcome to your Express app 🚅');
})

app.get("/users",  (req, res) => {
    connection.query("SELECT * FROM users", (sqlErr, sqlRes) => {
        if(sqlErr) res.status(500).json( { message: "Something went wrong!", error: sqlErr } );
        else {
          res.json({ data: sqlRes });
          res.status(200);
        }
    })
});

app.post("/createUser", (req, res) => {
    const user = {...req.body};

    res.json({ reqBody: user })

    // connection.query(
    //   `INSERT INTO users (nickname,password, email) VALUES (?, ?, ?)`,
    //   [user.nickname, user.password, user.email],
    //   sqlErr => { if(sqlErr) throw sqlErr });
});

const port = process.env.PORT || 3000;

connection.connect(err => {
    if (err) console.log("no connect", err);
    else console.log("Successfully connected to the database.");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})