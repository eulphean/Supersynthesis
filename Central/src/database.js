// Author: Amay Kataria
// Date: 02/15/2022
// File: Database.js
// Description: Helper module to handle all database related methods. This module is responsible
// to read, load, commit from the database.

var Pool = require('pg').Pool;

// ------------------ postgresql database ---------------------- // 
const connString = process.env['DATABASE_URL'];
//const connString = 'postgresql://localhost/supersynth?user=amaykataria&password=abc123';
console.log('Database Connection String: ' + connString); 
const pool = new Pool({
    connectionString: connString
}); 

module.exports = {    
    saveData: function(data) {
        return onWriteDatabase(data)
    },

    readData: function(socket) {
        return onReadConfigs(socket);
    },

    readTimer: function() {
        return onReadTimers();
    },

    insertTimer: function(timerId) {
        return onInsertTimer(timerId);
    }
}

function onReadTimers() {
    let promise = new Promise((resolve, reject) => {
        pool.query('SELECT * FROM timer;', (error, result) => {
            if (error) {
                throw error;
            }

            console.log('Success: timers table successfully read.');
            let entries = result.rows; 
            resolve(entries);            
        });
    });
    return promise;
}

function onInsertTimer(timerId) {
    let promise = new Promise((resolve, reject) => {
        pool.query('INSERT INTO timer (id) VALUES ($1);', [timerId], (error, result) => {
            if (error) {
                throw error;
            }
            
            // Timer inserted successfully. 
            resolve();            
        });
    });
    return promise;
}


function onReadConfigs(socket) {
    console.log('Read database');
    let promise = new Promise((resolve, reject) => {
            pool.query('SELECT * FROM entries ORDER BY index DESC LIMIT 1;', (error, result) => {
            if (error) {
                console.log('Some error');
                throw error; 
            }

            
            console.log('Success: entries table successfully read.');
            let entries = result.rows; 
            resolve(entries);
        }); 
    });
    return promise; 
}

function onWriteDatabase(payload) {
    let index = payload['index'];
    let value = payload['config'];

    // First READ THE DATABSE if something like this exists. 
    // If it does, then update the data, else make a new commit. 
    let promise = new Promise((resolve, reject) => {
        pool.query('INSERT INTO entries (index, config) VALUES ($1, $2)', [index, value], (error, result) => {
            if (error) {
                throw error;
            }

            console.log('Success: ' + index + ' is new entry in the database.');
            resolve(payload);
        });
    });
    return promise; 
}