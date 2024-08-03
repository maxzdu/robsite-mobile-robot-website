const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require('ws');
const session = require("express-session");
const crypto = require("crypto");
const encoder = bodyParser.urlencoded();
const jwt = require('jsonwebtoken');

const app = express();
app.set('view engine','ejs');
const wss = new WebSocket.Server({ port: 8080 });
const wssr = new WebSocket.Server({ port: 8081 });
let wait=true;
let stations=12;
let dest=null;
let circel=null;
let stop=null;
let navigation="line follower";
let connectivity="websocket";
let bpath;
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
      cookie: { secure: false }, 
  })
);
function generateSecretKey() {
  const bytes = crypto.randomBytes(32);
  return bytes.toString("hex");
}
const config = {
  path: '${bpath}',
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  autoOpen: false,
};
const { SerialPort } = require('serialport');
const port = new SerialPort(config);
const { ReadlineParser } = require('@serialport/parser-readline');
const parser = new ReadlineParser({ delimiter: '\r\n' });


port.open((err) => {
  if (err) {
    console.log('------- error opening the port' + err.messages);
  }
  else console.log('------- opening the port is ok');
});
function bluetooth(){
console.log('------- 1');

//const { ByteLengthParser } = require('@serialport/parser-byte-length');
//const parser = new ByteLengthParser({length : 1});

console.log('------- 2');
port.pipe(parser);
parser.on('data', (data) => {
  chooseNextService();
  // || data.toString() === 'r' || data.toString() === 'l' || data.toString() === 'b'
  var d = new String(data.toString());
  console.log('jai reçu du Serial Port ' +d);
  var [type,value,unit]=d.split(' ');
  if(unit==="Stop"){
   wss.clients.forEach((client) => {
       client.send("o");
       });
  }
  if(type ==="Distance:"){


  }else{
    if(unit==="0"){
     
      port.write("f", (err) => {
        if (err) {
          console.log('------- error writing' + err.messages);
        } else console.log('------- writing is ok');
      });
     }
     if(unit==="1"){
      
      port.write("r", (err) => {
        if (err) {
          console.log('------- error writing' + err.messages);
        } else console.log('------- writing is ok');
      });
     }
     if(unit==="2"){
      port.write("l", (err) => {
      if (err) {
        console.log('------- error writing' + err.messages);
      } else console.log('------- writing is ok');
    });
     }
     if(unit==="3"){
        port.write("f", (err) => {
        if (err) {
          console.log('------- error writing' + err.messages);
        } else console.log('------- writing is ok');
      });
     }
     if(unit==="4"){
  port.write("l", (err) => {
        if (err) {
          console.log('------- error writing' + err.messages);
        } else console.log('------- writing is ok');
      });
     }
     if(unit==="5"){
       port.write("r", (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });
       
     }
     if(unit==="6"){
        port.write("l", (err) => {
        if (err) {
          console.log('------- error writing' + err.messages);
        } else console.log('------- writing is ok');
      });
       }
     if(unit==="7"){
        port.write("f", (err) => {
        if (err) {
          console.log('------- error writing' + err.messages);
        } else console.log('------- writing is ok');
      });
     }
     if(unit==="8"){
      port.write("r", (err) => {
      if (err) {
        console.log('------- error writing' + err.messages);
      } else console.log('------- writing is ok');
    });
     }
     if(unit==="9"){
       port.write("r", (err) => {
        if (err) {
          console.log('------- error writing' + err.messages);
        } else console.log('------- writing is ok');
      });
     }
     if(unit===10){
      port.write("l", (err) => {
      if (err) {
        console.log('------- error writing' + err.messages);
      } else console.log('------- writing is ok');
    });}
     if(unit==="11"){
    
         port.write("f", (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });
     }
     
     if(unit==="12"){
         port.write("l", (err) => {
        if (err) {
          console.log('------- error writing' + err.messages);
        } else console.log('------- writing is ok');
      });
         }
     if(unit==="13"){
      port.write("r", (err) => {
        if (err) {
          console.log('------- error writing' + err.messages);
        } else console.log('------- writing is ok');
      })
       }
     if(unit==="14"){
      port.write("l", (err) => {
        if (err) {
          console.log('------- error writing' + err.messages);
        } else console.log('------- writing is ok');
      })
    }
     if(unit==="15"){
      port.write("s", (err) => {
        if (err) {
          console.log('------- error writing' + err.messages);
        } else console.log('------- writing is ok');
      })
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
    
        wss.clients.forEach((client) => {
       client.send("the robot has arrived ");
       });
    
       
     }
   
     }
}
 /*if (d.localeCompare('f') === 0 || d.localeCompare('b') === 0 || d.localeCompare('r') === 0 || d.localeCompare('l') === 0) {
    console.log('jai reçu du Serial Port ' + d);
    // console.log('------- debut de lecture');
    //  console.log(data.toString());
    Commande.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }*/
});}

wsss.on('connection', function connection(ws) {
  console.log('mobile connected');


  ws.on('message', function incoming(message) {
    console.log('Received message:', message);
    if (message instanceof Buffer) {

      message = message.toString();
    }

    var [latitudei, longitudei] = message.split(',');
    console.log('Latitude:', latitudei);
    console.log('Longitude:', longitudei);
    const currentLocation = {
      latitude: latitudei,
      longitude: longitudei,
    };


    controlRobot(currentLocation);
  });


  ws.on('close', function close() {
    console.log('Client disconnected');
  });
});


function waitforserviceend(){
if(wait === false){
chooseNextService();
}

}


const MAX_DISTANCE = 1; 


function moveForward() {
  console.log("forward");
  port.write("f", (err) => {
      if (err) {
        console.log('------- error writing' + err.messages);
      } else console.log('------- writing is ok');
    });
}

function moveBackward() {

  console.log("backward");
  port.write("b", (err) => {
    if (err) {
      console.log('------- error writing' + err.messages);
    } else console.log('------- writing is ok');
  });
}

function turnLeft() {

  console.log("left");
  port.write("l", (err) => {
    if (err) {
      console.log('------- error writing' + err.messages);
    } else console.log('------- writing is ok');
  });
}

function turnRight() {

  console.log("right");
  port.write("r", (err) => {
    if (err) {
      console.log('------- error writing' + err.messages);
    } else console.log('------- writing is ok');
  });
}

function stopRobot() {

  console.log("stop");
  port.write("s", (err) => {
    if (err) {
      console.log('------- error writing' + err.messages);
    } else console.log('------- writing is ok');
  });
}
const INITIAL_TARGET_POSITION = {
  latitude: 36.35733021,   
  longitude: 6.64083689,  
};


let targetPosition = INITIAL_TARGET_POSITION;
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; 
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in meters

  return distance;
}
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
function controlRobot(currentPosition) {
  if (!targetPosition) {
    return; 
  }


  const distance = calculateDistance(
    currentPosition.latitude,
    currentPosition.longitude,
    targetPosition.latitude,
    targetPosition.longitude
  );

  console.log('Distance to target:', distance);

  // Check if the robot has reached the target position
  if (distance <= MAX_DISTANCE) {
    stopRobot(); // Stop the robot when within the maximum distance
    console.log('Robot reached the target position');
    targetPosition = null; // Clear the target position
    return;
  }

  // Determine the movement direction based on the difference in longitude
  const deltaLongitude = targetPosition.longitude - currentPosition.longitude;

  if (deltaLongitude > 0) {
    turnRight();
  } else if (deltaLongitude < 0) {
    turnLeft();
  } else {
    const deltaLatitude = targetPosition.latitude - currentPosition.latitude;
    if (deltaLatitude > 0) {
      moveForward();
    } else if (deltaLatitude < 0) {
      moveBackward();
    }
  }
}
/*function simulateGPSUpdates() {
  setInterval(function () {
    const currentLocation = {
      latitude: Math.random() * 0.001 + 37.7749, 
      longitude: Math.random() * 0.001 - 122.4194,
    };

    console.log('Current location:', currentLocation);
    controlRobot(currentLocation);
  }, 1000);
}


simulateGPSUpdates();*/


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
   ws.send("f")
  }
  if(message.toString()==="1"){
   ws.send("r")
  }
  if(message.toString()==="2"){
  ws.send("l")
  }
  if(message.toString()==="3"){
    ws.send("f")
  }
  if(message.toString()==="4"){
   ws.send("r")
  }
  if(message.toString()==="5"){
     ws.send("f")
    
  }
  if(message.toString()==="6"){
    ws.send("f")
    }
  if(message.toString()==="7"){
    ws.send("l")
  }
  if(message.toString()==="8"){
  ws.send("l")
  }
  if(message.toString()==="9"){
    ws.send("f")
  }
  if(message.toString()===10){
  ws.send("f")}
  if(message.toString()==="11"){
 
     ws.send("r")
  }
  
  if(message.toString()==="12"){
    ws.send("s")
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
 
    
  }}
  if(message.toString()==="13"){
    ws.send("r")
    }
  if(message.toString()==="14"){
   ws.send("l")}
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
    console.log(message.toString())
    var set =message.toString();
    var [type,value]=set.split(' ');
    console.log(type,"============== ",value)
    if(type==="path"){
    bpath=value;
    }
    if(type==="timing"){
      if(connectivity==="Bluetooth"){
        console.log("timing changed")
        port.write("p", (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });
        setInterval(() => {
        }, 1000);
        port.write(value, (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });}
        if(connectivity==="websocket"){
         wssr.clients.forEach((client) => {
      client.send("p");
  });
   setInterval(() => {
        }, 1000);
             wssr.clients.forEach((client) => {
      client.send(value);
  });
        }
        }
         if(type==="speed"){
      if(connectivity==="Bluetooth"){
        console.log("timing changed")
         port.write("S", (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });
        setInterval(() => {
        }, 1000);
        port.write(value, (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });
        }
        if(connectivity==="websocket"){
         wssr.clients.forEach((client) => {
      client.send("S");
  });
   setInterval(() => {
        }, 1000);
             wssr.clients.forEach((client) => {
      client.send(value);
  });
        }
        }
           if(type==="Rotation"){
      if(connectivity==="Bluetooth"){
        console.log("timing changed")
         port.write("R", (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });
        setInterval(() => {
        }, 1000);
        port.write(value, (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });
        }
        if(connectivity==="websocket"){
         wssr.clients.forEach((client) => {
      client.send("R");
  });
   setInterval(() => {
        }, 1000);
             wssr.clients.forEach((client) => {
      client.send(value);
  });
        }
        }
           if(type==="distance"){
      if(connectivity==="Bluetooth"){
        console.log("timing changed")
         port.write("t", (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });
        setInterval(() => {
        }, 1000);
        port.write(value, (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });
        } if(connectivity==="websocket"){
         wssr.clients.forEach((client) => {
      client.send("t");
  });
   setInterval(() => {
        }, 1000);
             wssr.clients.forEach((client) => {
      client.send(value);
  });
        }}
if(message.toString()==="end of service"){
  chooseNextService();
}
if(message.toString()==="Bluetooth" && navigation==="line follower"){
  bluetooth();
  connectivity="Bluetooth";
}
if(message.toString()==="Bluetooth" ){
  connectivity="Bluetooth";
}
if(message.toString()==="Websocket" ){
  connectivity="websocket";
}
   try{
    const messager = JSON.parse(message);
   
if (typeof messager === 'object' && messager.type ==='request') {

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

    }
    respond=message.toString();
    console.log(`Received message: ${message}`);
    wss.clients.forEach((client) => {
  client.send(message.toString());
      if(message.toString()==="c"){
        if(status==="connected"){client.send("connected");}else{

          client.send("impossible to connect");
          
        
        }  
      
      }
        //client.send(message.toString()); 
        if(connectivity==="Bluetooth"){
        port.write(message.toString(), (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });}
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
  port:3306,
  password: "",
  database: "sql_login",
});

// Connect to the database
connection.connect(function (error) {
  if (error) throw error;
  else console.log("Connected to the database successfully!");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/Welcome/index.html");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/public/login/index.html");
});

app.post("/login", encoder, function (req, res) {
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
   req.session.username = loggedInUsername;
  const token = jwt.sign({ username: loggedInUsername }, secretKey, { expiresIn: '1h' });
        req.session.token = token;
  req.session.loggedIn = true;
if(mail ==="lamia.mezai@univ-constantine2.dz"){
        res.redirect("/controle");}else{res.redirect("/controlee");}
 
      } else {
        res.redirect("/login");
      }
      res.end();
    }
  );
});
function authenticateToken(req, res, next) {
  const token = req.session.token;

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.redirect('/login');
    }
    req.user = user;
    next();
  });
}
app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/public/Signup/index.html");
});
app.get("/table", function (req, res) {
  res.sendFile(__dirname + "/public/table.html");
});
app.post("/signup", encoder, function (req, res) {
  var fullName = req.body.fullName;
  var email = req.body.email;
  var password = req.body.password;
  connection.query(
    "SELECT * FROM usr WHERE email = ?",
    [email],
    function (error, results, fields) {
      if (error) throw error;

      if (results.length > 0) {

       res.redirect("/signup");
      } else {
        connection.query(
          "INSERT INTO usr (fullname, email, password) VALUES (?, ?, ?)",
          [fullName, email, password],
          function (error, results, fields) {
            if (error) throw error;
            res.redirect("/login");
          }
        );
      }
    }
  );
});

app.get("/services", function (req, res) {
  connection.query("SELECT * FROM services", function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
});
app.get("/controle", authenticateToken,  function (req, res) {
if (req.session.loggedIn) {

  const loggedInUsername = req.user.username;
 res.render('operateur', { loggedInUsername });}
 
  else {
    // Redirect to the login page or send an error response
    res.redirect("/login");
  }
});
app.get("/controlee", authenticateToken,  function (req, res) {
if (req.session.loggedIn) {


     const loggedInUsername = req.user.username;
    res.render('interface_ens', { loggedInUsername });

  
  
  } else {
    // Redirect to the login page or send an error response
    res.redirect("/login");
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
       /*    wssr.clients.forEach((client) => {
      client.send("line follower");
  });*/
      });
    } else {
      console.log('No waiting services found');
    }
  });
}

app.listen(4000);
