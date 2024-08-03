const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();
app.use("/assets", express.static("assets"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sql_login",
});

// Connect to the database
connection.connect(function (error) {
  if (error) throw error;
  else console.log("Connected to the database successfully!");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", encoder, function (req, res) {
  // Handle the login form submission
  var email = req.body.email;
  var password = req.body.password;

  connection.query(
    "SELECT * FROM usr WHERE email = ? AND password = ?",
    [email, password],
    function (error, results, fields) {
      if (results.length > 0) {
        res.redirect("/welcome");
      } else {
        res.redirect("/login");
      }
      res.end();
    }
  );
});

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/signup", encoder, function (req, res) {
  // Handle the signup form submission
  var fullName = req.body.fullName;
  var email = req.body.email;
  var password = req.body.password;

  connection.query(
    "INSERT INTO usr (fullname, email, password) VALUES (?, ?, ?)",
    [fullName, email, password],
    function (error, results, fields) {
      if (error) throw error;
      res.redirect("/welcome");
      res.end();
    }
  );
});

app.get("/welcome", function (req, res) {
  res.sendFile(__dirname + "/operateur.html");
});

app.listen(4000);
