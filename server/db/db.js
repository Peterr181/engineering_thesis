import mysql from "mysql";

const connectionOptions = process.env.JAWSDB_URL
  ? process.env.JAWSDB_URL
  : {
      host: "localhost",
      user: "root",
      password: "",
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
