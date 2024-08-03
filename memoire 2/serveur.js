const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require('ws');
const session = require("express-session");
const crypto = require("crypto");
const encoder = bodyParser.urlencoded();

const app = express();
const wss = new WebSocket.Server({ port: 8080 });
const wssr = new WebSocket.Server({ port: 8081 });
let wait=true;
let stations=12;
let dest=null;
let circel=null;
let stop=null;
const wsss = new WebSocket.Server({ port: 8082 });
const secretKey = generateSecretKey();
 let chosenService = {
        date:"",
        username:"",
        roomnumber:"",
        service:"",
        status :"",
      };
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
  })
);
function generateSecretKey() {
  const bytes = crypto.randomBytes(32);
  return bytes.toString("hex");
}
wsss.on('connection', function connection(ws) {
    console.log("mobile connected");
    ws.on('message', function incoming(message) {
      if (message instanceof Buffer) {
        // Convert the Buffer to a string
        message = message.toString();
      }
      
      console.log('Received message:', message);
  
      // Handle the received location message here
      const [latitude, longitude] = message.split(',');
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
    });
  });

function waitforserviceend(){
if(wait === false){
chooseNextService();
}

}



let status = "disconnected";
let mail;
let loggedInUsername = '';
wssr.on('connection', (ws) => {
  status="connected"
  chooseNextService();
 
  console.log('robot connected');
  console.log(dest);
  wssr.clients.forEach((client) => {
      client.send("line follower");
  });
ws.on('message',(message)=>{
ws
console.log(message.toString());
  if(message.toString()==="0"){
   ws.send("F")
  }
  if(message.toString()==="1"){
   ws.send("R")
  }
  if(message.toString()==="2"){
  ws.send("L")
  }
  if(message.toString()==="3"){
    ws.send("F")
  }
  if(message.toString()==="4"){
   ws.send("R")
  }
  if(message.toString()==="5"){
     ws.send("F")
    
  }
  if(message.toString()==="6"){
    ws.send("F")
    }
  if(message.toString()==="7"){
    ws.send("L")
  }
  if(message.toString()==="8"){
  ws.send("L")
  }
  if(message.toString()==="9"){
    ws.send("F")
  }
  if(message.toString()===10){
  ws.send("F")}
  if(message.toString()==="11"){
 
     ws.send("R")
  }
  
  if(message.toString()==="12"){
    ws.send("S")
       --stations;
       ++stop;
       console.log(stations);
       if(parseInt(stop) === 4){
        console.log("robot has completed a circle");
        ++circel;
        stations =12;
        stop =null;          
       }
    if (parseInt(stations) === parseInt(dest)){
     
      const updateSql = 'UPDATE services SET status = ? WHERE Date = ?';
    const updateParams = ['done', chosenService.date];
    connection.query(updateSql, updateParams, (error) => {
      if (error) {
        console.error('Error updating the service status:', error);
        return;
      }
      console.log('Service status updated to "done"');
    });
     console.log("here");
        ws.send("target reached");
     wss.clients.forEach((client) => {
    client.send("the robot has arrived ");
    });
 chooseNextService();
    
  }}
  if(message.toString()==="13"){
    ws.send("R")
    }
  if(message.toString()==="14"){
   ws.send("L")}
  if(message.toString()==="15"){
   wss.clients.forEach((client) => {
    client.send("out of path please redirect");
    });

  }
  
})
  
  ws.on('close', () => {
    status="disconnected"
    console.log('robot disconnected');
  });
  
});


wss.on('connection', (ws) => {
  console.log('Client connected');
 
  ws.on('message', (message) => {
if(message.toString()==="end of service"){
wait=false;
}
   try{
    const messager = JSON.parse(message);
   
if (typeof messager === 'object' && messager.type ==='request') {

  messager.username=loggedInUsername;
  console.log('Received an object');
  console.log('Type:', messager.type);
   console.log('time:', messager.timestamp);
   console.log('service:', messager.service);
  console.log('Username:', messager.username);
  console.log('Room Number:', messager.roomNumber);
   ws.send(JSON.stringify(messager));
   const sql = 'INSERT INTO services (Date, username, roomnumber, service, status) VALUES (?, ?, ?, ?, ?)';
   let values =[messager.timestamp, messager.username, messager.roomNumber, messager.service, 'waiting'];
   connection.query(
        "SELECT * FROM services WHERE status = 'ongoing'",
        function (error, results, fields) {
          if (error) throw error;

          if (results.length > 0) {
            // There is a service with status "ongoing", set the new request status to "waiting"
            values = [messager.timestamp, messager.username, messager.roomNumber, messager.service, 'waiting'];
          } else {
            // No ongoing service, set the new request status to "ongoing"
             values = [messager.timestamp, messager.username, messager.roomNumber, messager.service, 'ongoing'];
          }
connection.query(sql, values, (error, results) => {
  if (error) {
    console.error('Error storing request: ', error);
    return;
  }
  console.log('Request stored successfully');
  });
  
});
}}catch (error) {
      console.log('Received a non-JSON message:', message);
      // Handle the non-JSON message
    }
if (message.toString()==="end of service"){

}
    respond=message.toString();
    console.log(`Received message: ${message}`);
    wss.clients.forEach((client) => {
  
      if(message.toString()==="c"){
        if(status==="connected"){client.send("connected");}else{
          //try to connect to the robot
          client.send("impossible to connect");
          
        
        }  
      
      }
        client.send(message.toString()); 
    }
    );
  
    wssr.clients.forEach((client) => {
      client.send(message.toString());
  });
    let response;
     if (message === "f") {
    //   vehicle.moveForward();
    response="f";
   // ws.send(message);
     } else if (message === "b") {
    //   vehicle.moveBackward();
    response="b";
    //ws.send(message);
     } else if (message === "l") {
    //   vehicle.turnLeft();
    response="l";
    //ws.send(message);
     } else if (message === "r") {
    //   vehicle.turnRight();
    response="r";
    //ws.send(message);
     } else if (message === "s") {
    //   vehicle.stop();
    response="s";
    //ws.send("s");
     }
  });


  // Listen for WebSocket disconnections
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  
});



app.use("/assets", express.static(__dirname + "/assets"));
app.use(express.static('public'));
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
  res.sendFile(__dirname + "/public/login.html");
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
      loggedInUsername = results[0].fullname; 
        console.log('loggedInUsername');
      console.log(loggedInUsername);
      mail=email;
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
app.get("/services", function (req, res) {
  connection.query("SELECT * FROM services", function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
});
app.get("/welcome", function (req, res) {
if(mail ==="lamia.mezai@univ-constantine2.dz"){
  res.sendFile(__dirname + "/public/operateur.html");}
  else{
    res.sendFile(__dirname + "/public/interface_ens.html");
  }
});
app.post("/logout", function (request, response) {
  loggedInUsername = "";
  request.session.destroy(function (error) {
    if (error) throw error;
    console.log("User logged out successfully");
    response.redirect("/");
  });
});
 function chooseNextService() {
 wait=true;
  const sql = 'SELECT * FROM services WHERE status = ? ORDER BY Date ASC LIMIT 1';
  const status = 'waiting';
  connection.query(sql, [status], (error, results) => {
    if (error) {
      console.error('Error executing the SQL query:', error);
      return;
    }
    
    if (results.length > 0) {
      
        chosenService.date= results[0].Date,
        chosenService.username=  results[0].username,
         chosenService.roomnumber=  results[0].roomnumber,
         chosenService.service=  results[0].service,
        chosenService.status= 'ongoing',

      console.log('Chosen Service:', chosenService);
      dest=chosenService.roomnumber;
      // Update the status of the chosen service to "ongoing"
      const updateSql = 'UPDATE services SET status = ? WHERE Date = ?';
      const updateParams = ['ongoing', chosenService.date];
      connection.query(updateSql, updateParams, (error) => {
        if (error) {
          console.error('Error updating the service status:', error);
          return;
        }
        console.log('Service status updated to "ongoing"');
           wssr.clients.forEach((client) => {
      client.send("line follower");
  });
      });
    } else {
      console.log('No waiting services found');
    }
  });
}

app.listen(4000);
