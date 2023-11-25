import express from 'express';
import crypto, { createHash } from "crypto";
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

    const salt = crypto.randomBytes(16).toString('base64');

    const passwordHash = createHash("sha256")
      .update(user.password)
      .update(createHash("sha256").update(salt, "utf8").digest("hex"))
      .digest("hex");


    connection.query(
      "INSERT INTO users (nickname, password, email, salt) VALUES (?, ?, ?, ?)",
      [user.nickname, passwordHash, user.email, salt],
      sqlErr => {
        if(sqlErr) res.status(500).json( { message: "Something went wrong" })
        else res.json( { message: "Successfully" } )
      })
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

app.get("/authenticationUser", (req, res) => {
  const user = {...req.body};

  connection.query(
    `SELECT * FROM users WHERE id = ${user.nickname}`,
    (sqlErr, sqlRes) => {
      if(sqlErr) {
        res.status(404).json({message: "User not found"})
        throw sqlErr;
      }
      else {
        const sqlUser = sqlRes.value[0];

        const passwordHash = createHash("sha256")
          .update(sqlUser.password)
          .update(createHash("sha256").update(sqlUser.salt, "utf8").digest("hex"))
          .digest("hex");

        connection.query(
          `SELECT * FROM users WHERE password = ${passwordHash}`,
          (sqlErr2, sqlRes2) => {
            if(sqlErr2) res.status(404).json({ message: "Password is uncorrected" })
            else res.json({ data: sqlRes2 });
          })
      }
    });
})

app.patch("/updateNickname/:userID/:newNickname", (req, res) => {
  const user = { ...req.params };

  connection.query(
    `UPDATE users SET nickname = ? WHERE id = ?`,
    [user.newNickname, user.userID],
    sqlErr => {
      if(sqlErr) {
        res.json({ message: "Something went wrong" })
        throw sqlErr
      }
      else res.json({ message: "successfully" })
    });
})

app.delete("/deleteUser/:userID", (req, res) => {
  const user = req.params;

  connection.query("DELETE FROM users WHERE id = ?", [user.userID], sqlErr => {
    if(sqlErr) {
      res.json({ message: "Something went wrong" })
      throw sqlErr
    }
    else res.json({ message: "successfully" })
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