// Author: Amay Kataria
// Date: 04/23/2023
// File: DreamManager.js
// Description: Handle all the business logic related to the Dream mode.

var MODES = require('./CommonTypes').MODES;
var EVENTS = require('./CommonTypes').EVENTS;
var CommonManager = require('./CommonManager'); 
const MAX_SEQUNCER_COUNT = 4;

class DreamManager extends CommonManager {
    constructor(io, sequencer) {
        super(io, sequencer); 
        // How many times a light config has been counted.
        this.currentSequenceCount = 0; 
        this.maxSequenceCount = MAX_SEQUNCER_COUNT;
        // Set this callback to track the count of sequence.
        this.sequencer.setIncrementSequenceCountCallback(this.incrementSequenceCount.bind(this));
        this.currentConfig = '';
    }

    update(previousMode) {
        if (this.sequencer.isRunning()) {
            if (previousMode !== MODES.DREAM) {
                // We are coming from another state, set new sequencer config.
                this.currentConfig = this.getRandomConfig();
                this.sequencer.updateCurrentConfig(this.currentConfig);
                this.resetMaxSequenceCount();
            } else {
                if (this.currentConfig) {
                    // Sequencer is running and current config exists already, just send this config back to 
                    // the sender. This is just another client connecting during the dream state. 
                    this.socket.emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig);
                } else {
                    // Sequencer is running, current state is dream, and we don't have a current config.
                    // Code should never get there. We should always have a currentConfig when the sequencer is running.
                    console.log('WARNING: We should always have a current config when the sequencer is running!!!');
                }
            }
        } else {
            this.currentConfig = this.getRandomConfig();
            this.sequencer.begin(this.currentConfig);
            this.resetMaxSequenceCount();
        }
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
      }

    resetMaxSequenceCount() {
        const randCount = this.getRandomInt(1, MAX_SEQUNCER_COUNT);
        this.maxSequenceCount = randCount;
        this.currentSequenceCount = 0; 
    }

    getRandomConfig() {
        const numEntries = this.lightConfigs.length; 
        const randIdx = Math.floor(Math.random() * numEntries); 
        return this.lightConfigs[randIdx];
    }

    incrementSequenceCount() {
        if (this.currentMode === MODES.DREAM) {
            this.currentSequenceCount += 1; 
            if (this.currentSequenceCount === this.maxSequenceCount) {
                this.currentConfig = this.getRandomConfig();
                this.sequencer.updateCurrentConfig(this.currentConfig);
                this.resetMaxSequenceCount();
                return true;
            } 
        }
        return false;
    }
}

module.exports = DreamManager;