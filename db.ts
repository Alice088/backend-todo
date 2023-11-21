import mysql from "mysql2"
import dotenv from "dotenv"

dotenv.config();


const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: +(process.env.MYSQLPORT ?? "3306"),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
});

export { connection };