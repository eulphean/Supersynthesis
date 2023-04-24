// Author: Amay Kataria
// Date: 04/23/2023
// File: DreamManager.js
// Description: Handle all the business logic related to the Dream mode.

var MODES = require('./CommonTypes').MODES;
var EVENTS = require('./CommonTypes').EVENTS;
var CommonManager = require('./CommonManager'); 

class DreamManager extends CommonManager {
    constructor(io, sequencer) {
        super(io, sequencer); 
        this.sequenceCount = -1; 
        // Set this callback to track the count of sequence.
        this.sequencer.setIncrementSequenceCountCallback(this.incrementSequenceCount.bind(this));
    }

    update(previousMode) {
        // If there is a valid dream config, emit it back to the socket. 
        if (this.currentConfig) {
            // Emit this config to socket
            this.socket.emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig);
        } else {
            // Get a new random config and assign it to the sequencer. 
            const numEntries = this.lightConfigs.length; 
            const randIdx = Math.floor(Math.random() * numEntries); 
            this.currentConfig = this.lightConfigs[randIdx];
        }

        // If the sequencer is not running, start it.
        if (!this.sequencer.isRunning()) {
            this.sequencer.begin(this.currentConfig['config']);
            // Reset count.
            this.sequenceCount = -1;
            return;
        } 
        
        // Are we coming from Score mode? That needs a config update for the sequencer.
        if (previousMode === MODES.SCORE) {
            this.sequencer.updateInterval(this.currentConfig['config']);
            // Reset count.
            this.sequenceCount = -1; 
            // Send all the connected clients this config.
            this.io.of('/app').emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig); 
        }
    }

    incrementSequenceCount() {
        if (this.currentMode === MODES.DREAM) {
            // How many times a light config has been counted.
            this.sequenceCount = this.sequenceCount + 1;
            if (this.sequenceCount === 2) { // Set a good random number here (with a max one)
                // Get a random config and send it across.
                const numEntries = this.lightConfigs.length; 
                const randIdx = Math.floor(Math.random() * numEntries); 
                this.currentConfig = this.lightConfigs[randIdx];

                this.sequencer.updateInterval(this.currentConfig['config']);
                // Send all the connected clients this config.
                this.io.of('/app').emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig); 

                // Reset sequence count.
                this.sequenceCount = -1;
            }
        }
    }
}

module.exports = DreamManager;