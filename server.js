const express = require("express");
const WebSocket = require('ws');
const session = require("express-session");


const app = express();
const wss = new WebSocket.Server({ port: 8080 });
const wssr = new WebSocket.Server({ port: 8081 });
let wait = true;
let stations = 12/*12*/;
let dest = 2/*null*/;
let circel = null;
let stop = 0;
let arrive = 0;

console.log('------- 1');
const { SerialPort } = require('serialport');
//const { ByteLengthParser } = require('@serialport/parser-byte-length');
//const parser = new ByteLengthParser({length : 1});
const { ReadlineParser } = require('@serialport/parser-readline');
const parser = new ReadlineParser({ delimiter: '\r\n' });
const config = {
  path: '/dev/tty.HC05-BT2-SPPDev',
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  autoOpen: false,
};
const port = new SerialPort(config);
port.open((err) => {
  if (err) {
    console.log('------- error opening the port' + err.messages);
  }
  else console.log('------- opening the port is ok');
});
console.log('------- 2');
port.pipe(parser);

parser.on('data', (data) => {
  // || data.toString() === 'r' || data.toString() === 'l' || data.toString() === 'b'
  var d = new String(data.toString());
  console.log('jai reçu du Serial Port ' + d);
  [type, val, unit] = d.split(' ');
  if (arrive === 0) {
    if (type === 'Distance:') {
      console.log('---------- ' + type + ' ' + val + ' ' + unit);
    }
    if (type === 'IR_Status') {
      console.log('++++++++++++++++ ' + type + ' ' + val + ' ' + unit);
      if ( (unit === "3") || (unit === "7") || (unit === "11") ) {
      //  if ( (unit === "3") ) {
        port.write('f', (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });
      }
     if ((unit === "0")||(unit === "1")||(unit === "5")||(unit === "8")||(unit === "9")||(unit === "13")) {
      //  if ((unit === "0")||(unit === "1")||(unit === "5")||(unit === "8")||(unit === "9")) {
        port.write('r', (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });
      }
      if ((unit === "2")||(unit === "4")||(unit === "6")||(unit === "10")||(unit === "12")||(unit === "14")) {
      //  if ((unit === "2")||(unit === "4")||(unit === "6")||(unit === "10")||(unit === "12")) {
        port.write('l', (err) => {
          if (err) {
            console.log('------- error writing' + err.messages);
          } else console.log('------- writing is ok');
        });
      }
      if (unit === "15") {
      //  if ((unit === "15")|| (unit === "13")||(unit === "14")){
        stop ++;
        console.log(" stop " + stop + " dest " + dest);
        if (stop == dest) {
          console.log("here " + " stop " + stop + " dest " + dest);
          port.write('s', (err) => {
            if (err) {
              console.log('------- error writing' + err.messages);
            } else console.log('------- writing is ok');
          });
          arrive = 1;
        }
        else{
          port.write('f', (err) => {
            if (err) {
              console.log('------- error writing' + err.messages);
            } else console.log('------- writing is ok');
          });
        }
      }
    }
  }
});
app.listen(4000);
