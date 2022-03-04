// Author: Amay Kataria
// Date: 02/15/2022
// File: Socket.js
// Description: Helper module to connect all socket based communication. 

var socket = require('socket.io');
var database = require('./database.js');
var LightManager = require('./lightManager.js')
var Sequencer = require('./Sequencer.js'); 

// Global variables. 
let appSocket; 
let io; 
let lightManager;
let sequencer; 


const EVENT_SAVE_PAYLOAD = 'event_save_payload';
const EVENT_TIME = 'event_time';
const EVENT_FULL_PAYLOAD = 'event_full_payload';

module.exports = {
    socketConfig: function(server) {
        io = socket(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
                credentials: false
            }
        }); 

        // /app and /central are two seperate namespaces. 
        appSocket = io.of('/app').on('connection', onWebClient); // Connects all web instance to this. 
        lightManager = new LightManager(io);
        sequencer = new Sequencer();
        sequencer.begin();
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
    appSocket.emit(EVENT_TIME , t); 
}

function onWebClient(socket) {
    console.log('New Web Client connection: ' + socket.id); 
    
    // Subscribe to all the callbacks.
    socket.on(EVENT_SAVE_PAYLOAD, onSaveData); 
    socket.on('disconnect', (socket) => {
        console.log(socket);
        onDisconnect(socket);
    });

    let count = io.of('/app').sockets.size;
    console.log('Members connected: ' + count);

    let promise = database.readData();
    Promise.all([promise]).then((values) => {
        let payload = values[0]; 
        // Do we have a valid config to work with? 
        if (payload.length > 0) {
            let configPayload = payload[0];
            sendFullConfigToSender(configPayload, socket);
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
    let promise = database.saveData(data);
    promise.then(payload => {
        if (lightManager.doesTimerExist()) { // At this time, timer will absolutely exist!!
            // Parse the payload back into object. 
            let parsedPayload = JSON.parse(payload['config']);
            let configPayload = {'index': payload['index'], 'config': parsedPayload};
            sendFullConfigToClients(configPayload);
            console.log("New payload from client. Recreate timer.");
            // Maybe update the timer.
            lightManager.updateTimer(parsedPayload); 
        } else {
            console.log('GRAVE ISSUE: TIMER DID NOT EXIST');
        }
    });
}

// Sending full payload to the clients. 
function sendFullConfigToSender(payload, socket) { 
    socket.emit(EVENT_FULL_PAYLOAD, payload);
}

// Sending full payload to the clients. 
function sendFullConfigToClients(payload) { 
    io.of('/app').emit(EVENT_FULL_PAYLOAD, payload);
}

function onDisconnect() {
    let count = io.of('/app').sockets.size;
    console.log('Web client disconnected.');
    console.log('Connected clients: ' + count);
    if (count === 0) {
        lightManager.clearTimer();
    }
}