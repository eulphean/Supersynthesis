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
        // How many times a light config has been counted.
        this.sequenceCount = 0; 
        // Set this callback to track the count of sequence.
        this.sequencer.setIncrementSequenceCountCallback(this.incrementSequenceCount.bind(this));
        this.currentConfig = '';
    }

    update(previousMode) {
        // If there is a valid dream config, emit it back to the socket. 
        if (this.currentConfig) {
            console.log("DREAM: Current config has been set previously.");
            // Emit this config to socket
            if (this.socket) {
                this.socket.emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig);
            }
        } else {
            console.log("DREAM: Current config doesnt exist. Set it!");
            // Get a new random config and assign it to the sequencer. 
            const numEntries = this.lightConfigs.length; 
            const randIdx = Math.floor(Math.random() * numEntries); 
            this.currentConfig = this.lightConfigs[randIdx];
            if (this.socket) {
                this.socket.emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig);
            }
        }

         // If the sequencer is not running, start it.
         if (!this.sequencer.isRunning()) {
            this.sequencer.begin(this.currentConfig);
            // Reset count.
            this.sequenceCount = 0;
        } else if (previousMode !== MODES.DREAM) {
            console.log('Dream: Update Sequencer Config');
            this.sequencer.updateCurrentConfig(this.currentConfig);
            // Reset count.
            this.sequenceCount = 0; 
        }       
    }

    incrementSequenceCount() {
        if (this.currentMode === MODES.DREAM) {
            this.sequenceCount = this.sequenceCount + 1;
            if (this.sequenceCount === 3) { // Set a good random number here (with a max one)
                // Get a random config and send it across.
                const numEntries = this.lightConfigs.length; 
                const randIdx = Math.floor(Math.random() * numEntries); 
                this.currentConfig = this.lightConfigs[randIdx];
                this.sequencer.updateCurrentConfig(this.currentConfig);
                // Reset sequence count.
                this.sequenceCount = 0;
            }
        }
    }
}

module.exports = DreamManager;

//   // Send all the connected clients this config (except yourself)
//   this.io.of('/app').emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig); 

//                   // Send all the connected clients this config.
//                   this.io.of('/app').emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig); 