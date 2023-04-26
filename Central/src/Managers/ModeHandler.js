// Author: Amay Kataria
// Date: 04/22/2023
// File: ModeHandler>.js
// Description: Module to handle all the modes that Backend application can be. Currently, there are 4 modes
// that the application is using: 0: Synth, 1: Dream, 2: Score, 3: Sweep. Based on the these modes, the application 
// uses the Sequnecer, etc to do things. 
var Sequencer = require('./Sequencer.js'); 
var Sweeper = require('./Sweeper.js');
var PayloadPackager = require('./PayloadPackager.js');
var DreamManager = require('./DreamManager.js');
var ScoreManager = require('./ScoreManager.js');
var database = require('../database.js');

var EVENTS = require('./CommonTypes.js').EVENTS;
var MODES = require('./CommonTypes.js').MODES;

class ModeHandler {
    constructor(io) {
        this.io = io; 
        this.payloadPackager = new PayloadPackager(io);
        this.sequencer = new Sequencer(this.payloadPackager);
        this.sweeper = new Sweeper(this.payloadPackager);
        this.dreamManager = new DreamManager(this.io, this.sequencer);
        this.scoreManager = new ScoreManager(this.io, this.sequencer);

        this.lightConfigs = '';
        this.currentMode = '';
        this.socket = ''; 
    }

    subscribe() {
        // Subscribe to all Mode related callbacks.
        this.socket.on(EVENTS.EVENT_SCORE_PAYLOAD, this.onScoreData.bind(this)); // Save config.
        this.socket.on(EVENTS.EVENT_SYNTH_NOTES, this.onSynthNotes.bind(this)); // Receive piano notes.
        this.socket.on(EVENTS.EVENT_MODE_PAYLOAD, this.onModeData.bind(this)); // Save mode data.
    }

    onModeData(data) {
        console.log('New Mode received.');
        // Commit to the database.
        // Forward this to other clients that are connected.
        let promise = database.updateModeData(data);
        promise.then(payload => {
            this.io.of('/app').emit(EVENTS.EVENT_MODE_PAYLOAD, payload);
            // Update current mode. 
            this.setCurrentMode(payload);
        });
    }

    // This goes directly to all the connected clients who are connected here.
    onSynthNotes(data) {
        console.log('New Synth notes received.');
        let parsedPayload = JSON.parse(data);
        this.io.of('/app').emit(EVENTS.EVENT_SYNTH_NOTES, parsedPayload);
    }

    onScoreData(data) {
        console.log('New Score data received.');
        let promise = database.saveData(data);
        promise.then(payload => {
            if (this.sequencer.isRunning()) { // At this time, sequencer will absolutely exist!!
                // Send this new payload to other connected clients.
                let parsedPayload = JSON.parse(payload['config']);
                let configPayload = {'index': payload['index'], 'config': parsedPayload};
                this.io.of('/app').emit(EVENTS.EVENT_FULL_PAYLOAD, configPayload);
               
                // Update sequencer with this new score data.
                console.log("New score data. Updating sequencer.");
                this.sequencer.updateCurrentConfig(parsedPayload); 
                
                // Update the light config state in the backend across the managers. 
                // And the currentConfig of the scoreManager for others connecting to the client.
                this.lightConfigs.unshift(configPayload); 
                this.setLightConfigs(this.lightConfigs);
                this.scoreManager.currentConfig = configPayload;

            } else {
                console.log('GRAVE ISSUE: TIMER DID NOT EXIST');
            }
        });
    }

    setCurrentSocket(socket) {
        this.socket = socket;
        this.dreamManager.setCurrentSocket(socket);
        this.scoreManager.setCurrentSocket(socket);
    }

    setLightConfigs(lightConfigs) {
        this.lightConfigs = lightConfigs; 
        this.dreamManager.setLightConfigs(lightConfigs);
        this.scoreManager.setLightConfigs(lightConfigs);
    }

    stopSequencer() {
        this.sequencer.stop();
    }

    setCurrentMode(newMode) {
        // Now do something based on the modes with the sequncer.
        switch (newMode) {
            case MODES.SYNTH: {
                console.log('New Mode: Synth');
                // Turn off the sequencer.
                this.checkAndStopSequencer();
                // Turn off the sweeper.
                this.checkAndStopSweeper();
                break;
            }

            case MODES.DREAM: {
                console.log('New Mode: Dream');
                // Turn off the sweeper.
                this.checkAndStopSweeper();
                // Send the previous mode.
                this.dreamManager.update(this.currentMode); 
                break;
            }

            case MODES.SCORE: {
                console.log('New Mode: Score');
                this.checkAndStopSweeper();
                // Send the previous mode. 
                this.scoreManager.update(this.currentMode);
                break;
            }

            case MODES.SWEEP: {
                console.log('New Mode: Sweep');
                this.checkAndStopSequencer();
                this.sweeper.begin();
                break;
            }

            default: {
                console.log('Default');
                break;
            }
        }

        // Update the current mode to new mode.
        this.currentMode = newMode;
        
        // Let the managers know what mode I'm currently in.
        this.dreamManager.setCurrentMode(newMode);
        this.scoreManager.setCurrentMode(newMode);

        // Emit the current mode to the app (socket) that just connected.
        this.socket.emit(EVENTS.EVENT_MODE_PAYLOAD, newMode);
    }

    checkAndStopSweeper() {
        if (this.sweeper.isRunning()) {
            this.sweeper.stop();
        }
    }

    checkAndStopSequencer() {
        if (this.sequencer.isRunning()) {
            this.sequencer.stop();
        }
    }
}

module.exports = ModeHandler;