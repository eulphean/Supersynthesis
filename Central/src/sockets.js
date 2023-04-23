// Author: Amay Kataria
// Date: 02/15/2022
// File: Socket.js
// Description: Helper module to connect all socket based communication. 

var socket = require('socket.io');
var database = require('./database.js');
var ModeHandler = require('./Modes/ModeHandler.js');

// Global variables. 
let appSocket; 
let io; 
let sequencer; 

const EVENT_TIME = 'event_time';

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
        modeHandler = new ModeHandler(io);
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

    // Current app (socket) interacting with the backend. 
    modeHandler.setCurrentSocket(socket); 
    // Subscribe to all mode handling related functions. 
    modeHandler.subscribe();

    // Subscribe to simple, local functions. 
    socket.on('disconnect', (socket) => {
        console.log(socket);
        onDisconnect(socket);
    });

    let count = io.of('/app').sockets.size;
    console.log('Members connected: ' + count);

    // Read all the light configs and the current mode from the database and send it 
    // to ModeHandler.
    let lightDataPromise = database.readData();
    let modeDataPromise = database.readModeData();
    Promise.all([lightDataPromise, modeDataPromise]).then((values) => {
        // Light data payload.
        let lightPayload = values[0]; 
        modeHandler.setLightConfigs(lightPayload);

        // Mode data payload.
        let modePayload = values[1];
        modeHandler.setCurrentMode(modePayload, socket);
    });
}

function onDisconnect() {
    let count = io.of('/app').sockets.size;
    console.log('Web client disconnected.');
    console.log('Connected clients: ' + count);
    if (count === 0) {
        //sequencer.stop();
    }
}

// // Data is 0, 1, 2, 3
// // 0: Synth, 1: Dream, 2: Score, 3: Sweep
// function onModeData(data) {
//     console.log('New Mode Received.');
//     // Commit to the database.
//     // Forward this to other clients that are connected.
//     let promise = database.updateModeData(data);
//     promise.then(payload => {
//         io.of('/app').emit(EVENT_MODE_PAYLOAD, payload);
//         // Update current mode. 
//         modeManager.setCurrentMode(payload);
//     });
// }

// function onPianoNotes(data) {
//     console.log('Piano Notes Received.');
//     let parsedPayload = JSON.parse(data);
//     sendPianoPayload(parsedPayload);
// }

// function onSaveData(data) {
//     console.log('New incoming data - save it in the DB.');
//     let promise = database.saveData(data);
//     promise.then(payload => {
//         if (sequencer.isRunning()) { // At this time, sequencer will absolutely exist!!
//             // Parse the payload back into object. 
//             let parsedPayload = JSON.parse(payload['config']);
//             let configPayload = {'index': payload['index'], 'config': parsedPayload};
//             sendFullConfigToClients(configPayload);
//             console.log("New payload from client. Updating sequencer.");
//             sequencer.updateInterval(parsedPayload); 
//         } else {
//             console.log('GRAVE ISSUE: TIMER DID NOT EXIST');
//         }
//     });
// }

// function sendPianoPayload(payload) {
//     io.of('/app').emit(EVENT_PIANO_NOTES, payload);
// }

// // Sending full payload to the clients. 
// function sendFullConfigToSender(payload, socket) { 
//     socket.emit(EVENT_FULL_PAYLOAD, payload);
// }

// // Sending full payload to the clients. 
// function sendFullConfigToClients(payload) { 
//     io.of('/app').emit(EVENT_FULL_PAYLOAD, payload);
// }
