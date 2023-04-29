// Author: Amay Kataria
// Date: 02/15/2022
// File: Database.js
// Description: Helper module to handle all database related methods. This module is responsible
// to read, load, commit from the database.

var Pool = require('pg').Pool;

// ------------------ postgresql database ---------------------- // 
const connString = process.env['DATABASE_URL'];
//const connString = 'postgres://amaykataria:abc123@localhost:5432/supersynth';
console.log('Database Connection String: ' + connString); 
const pool = new Pool({
    connectionString: connString
}); 

const DEFAULT_MODE = 0; 

module.exports = {    
    saveData: function(data) {
        return onWriteDatabase(data)
    },

    readModeData: function(socket) {
        return onReadModeData(socket);
    },

    updateModeData: function(socket) {
        return onUpdateModeData(socket);
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

function onReadModeData() {
    let promise = new Promise((resolve, reject) => {
        pool.query('SELECT * FROM modes;', (error, result) => {
            if (error) {
                throw error; 
            }

            console.log('Success: modes table successfully read.');
            let entries = result.rows;
            if (entries.length === 0) {
                // Add a new entry in the database. 
                // Then resolve it. 
                pool.query('INSERT INTO modes (mode) VALUES ($1);', [DEFAULT_MODE], (error, result) => {
                    if (error) {
                        throw error;
                    }
                    
                    // Mode inserted successfully.
                    console.log('Mode Inserted Successfully.');
                    resolve(DEFAULT_MODE);            
                });
            } else {
                // Get the mode from the first entry.
                resolve(entries[0]['mode']);
            }
        })
    });
    return promise;
}

function onUpdateModeData(newMode) {
    let promise = new Promise((resolve, reject) => {
        pool.query('SELECT * FROM modes;', (error, result) => {
            if (error) {
                throw error; 
            }

            console.log('Success: modes table successfully read.');
            let entries = result.rows;
            if (entries.length === 0) {
                // Add a new entry in the database. 
                // Then resolve it. 
                pool.query('INSERT INTO modes (mode) VALUES ($1);', [newMode], (error, result) => {
                    if (error) {
                        throw error;
                    }
                    
                    // Mode inserted successfully.
                    console.log('Mode Inserted Successfully.');
                    resolve(newMode);            
                });
            } else {
                pool.query('UPDATE modes SET MODE = ($1);', [newMode], (error, result) => {
                    if (error) {
                        throw error;
                    }
                    
                    // Mode inserted successfully.
                    console.log('Mode Updated Succesfully.');
                    resolve(newMode);            
                });
            }
        })
    });
    return promise;
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
            pool.query('SELECT * FROM entries ORDER BY index DESC;', (error, result) => {
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