// Author: Amay Kataria
// Date: 02/15/2022
// File: central.js
// Description: Core central web-server that stores all user entries and ensures
// connectivity with the python socket on the Raspbery pi. 

var express = require('express'); 
var cors = require('cors');

var sockets = require('./sockets.js');

// ------------------ Express webserver ---------------- //
var app = express(); 
app.use(cors());
app.use(express.json());
var server = require('http').createServer(app); 

// ------------------ Websocket Configuration ------------ //
sockets.socketConfig(server); 

// ------------------ Express webserver ------------------------ //
server.listen(process.env.PORT || 5000, function() {
    console.log('Central server successfully started'); 
});


// Ping the main server. 
sockets.pingAlive();
console.log('Start Start')