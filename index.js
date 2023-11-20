import express from 'express';
import { connection } from "./db.js"
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


//endpoints...
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

    connection.query(
      `INSERT INTO users (nickname,password, email) VALUES (?, ?, ?)`,
      [user.nickname, user.password, user.email],
      sqlErr => {
        if(sqlErr) throw sqlErr
        else res.status(200)
      });
});

app.get("/getUser/:userID", (req, res) => {
    const user = req.params;

    connection.query(
      `SELECT * FROM users WHERE id = ${user.userID}`,
      (sqlErr, sqlRes) => {
          if(sqlErr) res.status(404).json( { message: "User not found" } )
          else res.json({ data: sqlRes })
      });
});

app.put("/updateNickname/:userID/:newNickname", (req, res) => {
  const user = { ...req.params };

  connection.query(
    `UPDATE users SET nickname = ? WHERE id = ?`,
    [user.newNickname, user.userID],
    sqlErr => {
      if(sqlErr) throw sqlErr
      else res.status(200)
    });
})

app.delete("/deleteUser/:userID", (req, res) => {
  const user = req.params;

  connection.query("DELETE FROM users WHERE id = ?", [user.userID], sqlErr => {
    if(sqlErr) throw sqlErr
    else res.status(200)
  })
})


//connect and other...
connection.connect(err => {
    if (err) console.log("no connect", err);
    else console.log("Successfully connected to the database.");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})