// Author: Amay Kataria
// Date: 02/15/2022
// File: Socket.js
// Description: Helper module to connect all socket based communication. 

const { json } = require('express');
var socket = require('socket.io');
var database = require('./database.js');

// Global variables. 
let appSocket; 
let piSocket; 
let io; 

const room = 'supersynth';

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
        piSocket = io.of('/pi').on('connection', onPiClient); // Connects the raspberry pi (python) socket to this. 
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
    piSocket.emit('time', t);
}

// Every web client connects through this code path and subscribes to other events. 
// All socket events are registered here. 
function onWebClient(socket) {
    console.log('New Web Client connection: ' + socket.id); 
    // Join the room 
    socket.join(room); 
    var memberSize = io.of('/app').adapter.rooms.get(room).size;
    console.log(memberSize + ' members in supersynth.');

    // ------------------- Database communication -------------------- //
    socket.on('saveData', (data) => {
        database.saveData(data).then((payload) => {
            // Convert the stringified json back to proper json.
            let json = JSON.parse(payload['config']);
            payload['config'] = json;
            // Route the payload back to other connected clients.
            socket.to(room).emit('receiveData', payload); 
            var members = io.of('/app').adapter.rooms.get(room).size;
            console.log(members-1 + ' members were sent an update.');

            // Transmit parse this data and send it to the raspberry pi. 
            // Wait for the callback of success, then send it.         
            console.log(payload['config']);
            piSocket.emit('wavedata', payload['config']);
        });
        // Route this data to the raspberry pi client.
    });

    // Received a request to read data.
    socket.on('getData', () => {
        database.readData(socket); 
    });
    
    socket.on('disconnect', () => {
        console.log('Web client ' + socket.id + ' disconnected');
        socket.leave(room);
    });
}

function onPiClient(socket) {
    console.log('New Pi Client connection: ' + socket.id);
}