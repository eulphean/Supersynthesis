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
        if (this.sequencer.isRunning()) {
            if (previousMode !== MODES.SCORE) {
                this.currentConfig = this.getLatestConfig();
                this.sequencer.updateCurrentConfig(this.currentConfig);
            } else {
                // Sequencer is running and current config exists. Another client is connecting while the system is 
                // already running and we are in the Score mode. 
                if (this.currentConfig) {
                    this.socket.emit(EVENTS.EVENT_FULL_PAYLOAD, this.currentConfig);
                } else {
                    // Sequencer is running, the current state is score, and we don't have a current config. This is not possible.
                    console.log('WARNING: We should always have a current config when the sequencer is running!!!');
                }
            }
        } else {
            this.currentConfig = this.getLatestConfig();
            this.sequencer.begin(this.currentConfig);
        }
    }

    getLatestConfig() {
        return this.lightConfigs[0];
    }
}

module.exports = ScoreManager;

