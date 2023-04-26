// Author: Amay Kataria
// Date: 04/23/2023
// File: ScoreManager.js
// Description: Handle all the business logic associated with the Score state.
var MODES = require('./CommonTypes').MODES;
var EVENTS = require('./CommonTypes').EVENTS;
var CommonManager = require('./CommonManager');

class ScoreManager extends CommonManager {
    constructor(io, sequencer) {
        super(io, sequencer); 
        this.currentConfig = '';
    }

    update(previousMode) {
        if (this.currentConfig) {
            console.log("SCORE: Current config has been set previously.");
            // Emit this config to socket
            if (this.socket) {
                this.socket.emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig);
            }
        } else {
            console.log("SCORE: Current config doesnt exist. Set it!");
            // Read the first payload entry and show it in the sequencer
            this.currentConfig = this.lightConfigs[0];
            // Send this config to the app (socket) that just connected.
            if (this.socket) {
                this.socket.emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig);
            }
        }

        // If the sequencer is not running, start it.
        if (!this.sequencer.isRunning()) {
            this.sequencer.begin(this.currentConfig);
        } else {
            console.log('Score: Previous Mode: ' + previousMode);
            if (previousMode !== MODES.SCORE) {
                console.log('SCORE: Update Sequencer Config');
                this.sequencer.updateCurrentConfig(this.currentConfig);
            }
        }
    }
}

module.exports = ScoreManager;

            // // Send all the connected clients this config. 
            // this.io.of('/app').emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig); 