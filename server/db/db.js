import mysql from "mysql2";

const connectionOptions = process.env.JAWSDB_URL
  ? process.env.JAWSDB_URL
  : {
      host: "localhost",
      user: "peterr181",
      password: "password",
      database: "gymero",
    };

const db = mysql.createConnection(connectionOptions);

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

export default db;
