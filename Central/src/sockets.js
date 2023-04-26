// Author: Amay Kataria
// Date: 02/15/2022
// File: Socket.js
// Description: Helper module to connect all socket based communication. 

var socket = require('socket.io');
var database = require('./database.js');
var ModeHandler = require('./Managers/ModeHandler.js');
var MODES = require('./Managers/CommonTypes.js').MODES;

// Global variables. 
let appSocket; 
let io; 

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
    console.log('***New Web Client connection: ' + socket.id + '***'); 

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
        // Light configs.
        modeHandler.setLightConfigs(values[0]);

        // Current mode.
        modeHandler.setCurrentMode(values[1]);
    });
}

function onDisconnect() {
    let count = io.of('/app').sockets.size;
    console.log('Web client disconnected.');
    console.log('Connected clients: ' + count);
    if (count === 0) {
       console.log('Default');
       modeHandler.setCurrentMode(MODES.DREAM);
    }
}