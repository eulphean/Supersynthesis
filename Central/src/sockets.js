// Author: Amay Kataria
// Date: 02/15/2022
// File: Socket.js
// Description: Helper module to connect all socket based communication. 

var socket = require('socket.io');
var database = require('./database.js');
var LightManager = require('./lightManager.js')

// Global variables. 
let appSocket; 
let io; 
let lightManager;

module.exports = {
    socketConfig: function(server) {
        io = socket(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
                credentials: true
            }
        }); 

        // /app and /central are two seperate namespaces. 
        appSocket = io.of('/app').on('connection', onWebClient); // Connects all web instance to this. 
        lightManager = new LightManager(io);
    },

    // Send an event to all connected clients to keep the Socket Connection Alive. 
    // This event is sent every 1 second to every client connected. 
    pingAlive: function() {
        setInterval(ping, 1000);
    }
}

// Helper function. 
function ping() {
    var t = new Date().toTimeString(); 
    appSocket.emit('time', t); 
}

function onWebClient(socket) {
    console.log('New Web Client connection: ' + socket.id); 
    
    // Subscribe to all the callbacks.
    socket.on('saveData', onSaveData); 
    socket.on('getData', onReadData);
    socket.on('disconnect', (socket) => {
        console.log('DC'); console.log(socket);
        onDisconnect(socket);
    });

    let count = io.of('/app').sockets.size;
    console.log('Members connected: ' + count);

    let promiseConfig = database.readData();
    Promise.all([promiseConfig]).then((values) => {
        let payload = values[0]; 
        // Do we have a valid config to work with? 
        if (payload.length > 0) {
            let configPayload = payload[0];
            sendFullConfigToClient(configPayload);
            // Does timer exist? 
            if (lightManager.doesTimerExist()) {
                console.log('Timer already exists. Do nothing!!');
            } else {
                console.log('Timer doesnt exist. Create one!!');
                lightManager.setupTimer(configPayload['config']); 
            }
        }
    });
}

function onSaveData(data) {
    console.log('New incoming data - save it in the DB.');
    database.saveData(data).then(payload => {
        if (lightManager.doesTimerExist()) { // At this time, timer will absolutely exist!!
            // Parse the payload back into object. 
            let parsedPayload = JSON.parse(payload['config']);
            let configPayload = {'index': payload['index'], 'config': parsedPayload};
            sendFullConfigToClient(configPayload);
            console.log("New payload from client. Recreate timer.");
            // Start a fresh timer.
            lightManager.setupTimer(parsedPayload); 
        } else {
            console.log('GRAVE ISSUE: TIMER DID NOT EXIST');
        }
    });
}

// Sending full payload to the clients. 
function sendFullConfigToClient(payload) {    
    io.of('/app').emit('initialFullPayload', payload);
}

function onReadData() {
    console.log('Read data from DB: ');
    database.readData(socket);
}

function onDisconnect() {
    let count = io.of('/app').sockets.size;
    console.log('Web client disconnected.');
    console.log('Connected clients: ' + count);
    if (count === 0) {
        lightManager.clearTimer();
    }
}