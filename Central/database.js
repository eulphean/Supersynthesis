// Author: Amay Kataria
// Date: 02/15/2022
// File: Database.js
// Description: Helper module to handle all database related methods. This module is responsible
// to read, load, commit from the database.

var Pool = require('pg').Pool;

// ------------------ postgresql database ---------------------- // 
//const connString = process.env['DATABASE_URL'];
const connString = 'postgresql://localhost/supersynth?user=amaykataria&password=abc123';
console.log('Database Connection String: ' + connString); 
const pool = new Pool({
    connectionString: connString
}); 

module.exports = {    
    saveData: function(data) {
        return onWriteDatabase(data)
    },

    readData: function(socket) {
        onReadDatabase(socket);
    }
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

function onReadDatabase(socket) {
    console.log('Read database');
    pool.query('SELECT * FROM entries ORDER BY index DESC LIMIT 1;', (error, result) => {
        if (error) {
            console.log('Some error');
            throw error; 
        }

        if (result.rows.length > 0) { // Entry already exists..
            let entries = result.rows;
            if (entries.length > 0) {
                // Only a single entry should be received. 
                let payload = {
                    'index' : entries[0]['index'],
                    'config': entries[0]['config']
                }
                // We only need the last entry. 
                socket.emit('receiveData', payload); 
                console.log('Config data emitted for index: ' + payload['index']); 
            } else {
                console.log('Sorry: Nothing to emit. Database is empty!');
            }
        }
    }); 
}