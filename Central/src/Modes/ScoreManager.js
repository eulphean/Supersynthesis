// Author: Amay Kataria
// Date: 04/23/2023
// File: ScoreManager.js
// Description: Handle all the business logic associated with the Score state.
var MODES = require('./CommonTypes').MODES;
var EVENTS = require('./CommonTypes').EVENTS;

class ScoreManager {
    constructor() {
        this.currentConfig = ''
    }

    update(previousMode, lightConfigs, io, socket, sequencer) {
        if (this.currentConfig) {
            // Emit this config to socket
            socket.emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig);
        } else {
             // Read the first payload entry and show it in the sequencer
             this.currentConfig = lightConfigs[0];
             // Send this config to the app (socket) that just connected.
             socket.emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig);
        }

        // If the sequencer is not running, start it.
        if (!sequencer.isRunning()) {
            sequencer.begin(this.currentConfig['config']);
            return;
        } 

        if (previousMode === MODES.DREAM) {
            sequencer.updateInterval(this.currentConfig['config']);
            // Send all the connected clients this config. 
            io.of('/app').emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig); 
        }
    }
}

module.exports = ScoreManager;