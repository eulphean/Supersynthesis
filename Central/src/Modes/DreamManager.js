// Author: Amay Kataria
// Date: 04/23/2023
// File: DreamManager.js
// Description: Handle all the business logic related to the Dream mode.

var MODES = require('./CommonTypes').MODES;
var EVENTS = require('./CommonTypes').EVENTS;

class DreamManager {
    constructor() {
        this.currentConfig = ''
    }

    update(previousMode, lightConfigs, io, socket, sequencer) {
        // If there is a valid dream config, emit it back to the socket. 
        if (this.currentConfig) {
            // Emit this config to socket
            socket.emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig);
        } else {
            // Get a new random config and assign it to the sequencer. 
            const numEntries = lightConfigs.length; 
            const randIdx = Math.floor(Math.random() * numEntries); 
            this.currentConfig = lightConfigs[randIdx];
        }

        // If the sequencer is not running, start it.
        if (!sequencer.isRunning()) {
            sequencer.begin(this.currentConfig['config']);
            return;
        } 
        
        // Are we coming from Score mode? That needs a config update for the sequencer.
        if (previousMode === MODES.SCORE) {
            sequencer.updateInterval(this.currentConfig['config']);
            // Send all the connected clients this config.
            io.of('/app').emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig); 
        }
    }
}

module.exports = DreamManager;