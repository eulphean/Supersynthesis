// Author: Amay Kataria
// Date: 04/22/2023
// File: ModeHandler>.js
// Description: Module to handle all the modes that Backend application can be. Currently, there are 4 modes
// that the application is using: 0: Synth, 1: Dream, 2: Score, 3: Sweep. Based on the these modes, the application 
// uses the Sequnecer, etc to do things. 
var Sequencer = require('../Sequencer/Sequencer.js'); 
var database = require('../database.js');
var DreamManager = require('./DreamManager.js');
var ScoreManager = require('./ScoreManager.js');
var EVENTS = require('./CommonTypes.js').EVENTS;
var MODES = require('./CommonTypes.js').MODES;

class ModeHandler {
    constructor(io) {
        this.io = io; 
        this.sequencer = new Sequencer(io);
        this.dreamManager = new DreamManager();
        this.scoreManager = new ScoreManager();
        this.lightConfigs = '';
        this.currentMode = '';
        this.socket = ''; 
    }

    subscribe() {
        // Subscribe to all Mode related callbacks.
        this.socket.on(EVENTS.EVENT_SAVE_PAYLOAD, this.onSaveData.bind(this)); // Save config.
        this.socket.on(EVENTS.EVENT_SYNTH_NOTES, this.onSynthNotes.bind(this)); // Receive piano notes.
        this.socket.on(EVENTS.EVENT_MODE_PAYLOAD, this.onModeData.bind(this)); // Save mode data.
    }

    onSaveData() {
        // console.log('New incoming data - save it in the DB.');
        // let promise = database.saveData(data);
        // promise.then(payload => {
        //     if (sequencer.isRunning()) { // At this time, sequencer will absolutely exist!!
        //         // Parse the payload back into object. 
        //         let parsedPayload = JSON.parse(payload['config']);
        //         let configPayload = {'index': payload['index'], 'config': parsedPayload};
        //         sendFullConfigToClients(configPayload);
        //         console.log("New payload from client. Updating sequencer.");
        //         sequencer.updateInterval(parsedPayload); 
        //     } else {
        //         console.log('GRAVE ISSUE: TIMER DID NOT EXIST');
        //     }
        // });
    }

    onSynthNotes(data) {
        console.log('Synth Notes Received.');
        let parsedPayload = JSON.parse(data);
        this.io.of('/app').emit(EVENTS.EVENT_SYNTH_NOTES, parsedPayload);
    }

    onModeData(data) {
        console.log('New Mode Received.');
        // Commit to the database.
        // Forward this to other clients that are connected.
        let promise = database.updateModeData(data);
        promise.then(payload => {
            this.io.of('/app').emit(EVENTS.EVENT_MODE_PAYLOAD, payload);
            // Update current mode. 
            this.setCurrentMode(payload);
        });
    }

    setCurrentSocket(socket) {
        this.socket = socket;
    }

    setLightConfigs(lightConfigs) {
        this.lightConfigs = lightConfigs;
    }

    stopSequencer() {
        this.sequencer.stop();
    }

    setCurrentMode(newMode) {
        // Now do something based on the modes with the sequncer.
        switch (newMode) {
            case MODES.SYNTH: {
                console.log('New Mode: Synth');
                // Turn off the sequencer since we'll be processing the piano events.
                this.sequencer.stop();
                break;
            }

            case MODES.DREAM: {
                console.log('New Mode: Dream');
                // Send the previous mode.
                this.dreamManager.update(this.currentMode, this.lightConfigs, this.io, this.socket, this.sequencer); 
                break;
            }

            case MODES.SCORE: {
                console.log('New Mode: Score');
                // Send the previous mode. 
                this.scoreManager.update(this.currentMode, this.lightConfigs, this.io, this.socket, this.sequencer);
                break;
            }

            case MODES.SWEEP: {
                console.log('New Mode: Sweep');
                // Turn off the sequencer
                // Create a custom score module to handle this
                break;
            }

            default: {
                console.log('Default');
                break;
            }
        }

        // Update the current mode to new mode.
        this.currentMode = newMode;

        // Emit the current mode to the app (socket) that just connected.
        this.socket.emit(EVENTS.EVENT_MODE_PAYLOAD, newMode);
    }

}

module.exports = ModeHandler;