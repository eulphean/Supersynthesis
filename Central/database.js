// Author: Amay Kataria
// Date: 02/15/2022
// File: Database.js
// Description: Helper module to handle all database related methods. This module is responsible
// to read, load, commit from the database.

var Pool = require('pg').Pool;

// ------------------ postgresql database ---------------------- // 
// const connString = process.env['DATABASE_URL'];
const connString = 'postgresql://localhost/supersynth?user=amaykataria&password=abc123';
console.log('Database Connection String: ' + connString); 
const pool = new Pool({
    connectionString: connString
}); 

module.exports = {    
    saveData: function(data) {
        onWriteDatabase(data)
    },

    readData: function(socket) {
        onReadDatabase(socket);
    }
}

function onDeletePreset(presetName) {
    pool.query('DELETE FROM presets WHERE name=$1', [presetName], (error, result) => {
        if (error) {
            throw error; 
        }

        console.log(presetName + ' entry successfully deleted from the database.'); 
    });
}

function onWriteDatabase(data) {
    let index = data['index'];
    let value = data['data'];

    // First READ THE DATABSE if something like this exists. 
    // If it does, then update the data, else make a new commit. 
    pool.query('INSERT INTO entries (index, entry) VALUES ($1, $2)', [index, value], (error, result) => {
        if (error) {
            throw error;
        }

        console.log('Success: ' + index + ' is new entry in the database.');
    });
}

function onReadDatabase(socket) {
    console.log('Read database');
    pool.query('SELECT * FROM presets', (error, result) => {
        if (error) {
            console.log('Some error');
            throw error; 
        }

        if (result.rows.length > 0) { // Entry already exists..
            let entries = result.rows;
            socket.emit('receivePresets', entries); 
            console.log('Presets emitted'); 
        }
    }); 
}