const { writeSync } = require('fs');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const wssr = new WebSocket.Server({ port: 8081 });
// Listen for WebSocket connections

let status = "disconnected";
wssr.on('connection', (ws) => {
  status="connected"
 
  console.log('robot connected');
ws.on('message',(message)=>{
console.log(message.toString());
  if(message.toString()==="0,0,0,0"){
    wss.clients.forEach((client) => {
      client.send("out of range");
  });
  }
  if(message.toString()==="0,0,0,1"){
    wss.clients.forEach((client) => {
      client.send("out of range");
  });
  }
  if(message.toString()==="0,0,1,0"){
    wss.clients.forEach((client) => {
      client.send("out of range");
  });
  }
  if(message.toString()==="0,0,1,1"){
    wss.clients.forEach((client) => {
      client.send("out of range");
  });
  }
  if(message.toString()==="0,1,0,0"){
    wss.clients.forEach((client) => {
      client.send("out of range");
  });
  }
  if(message.toString()==="0,1,0,1"){
    ws.send("R")
  }
  if(message.toString()==="0,1,1,0"){
    ws.send("L")
  }
  if(message.toString()==="0,1,1,1"){
    wss.clients.forEach((client) => {
      client.send("out of range");
  });
  }
  if(message.toString()==="1,0,0,0"){
    wss.clients.forEach((client) => {
      client.send("out of range");
  });
  }
  if(message.toString()==="1,0,0,1"){
    ws.send("R")
  }
  if(message.toString()==="1,0,1,0"){
    ws.send("L")
  }
  if(message.toString()==="1,0,1,1"){
    wss.clients.forEach((client) => {
      client.send("out of range");
  });
  }
  if(message.toString()==="1,1,0,0"){
    ws.send("F")
  }
  if(message.toString()==="1,1,0,1"){
    wss.clients.forEach((client) => {
      client.send("out of range");
  });
  }
  if(message.toString()==="1,1,1,0"){
    wss.clients.forEach((client) => {
      client.send("out of range");
  });
  }
  if(message.toString()==="1,1,1,1"){
    ws.send("S")
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




