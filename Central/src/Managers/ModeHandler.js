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

        this.synthQueue = []; 

        this.lightConfigs = '';
        this.currentMode = '';
        this.socket = ''; 

        // Default synth config
        this.synthConfig = [];
        for (let i = 0; i < 24; i++) {
            const config = {'socketId': '', 'val' : 0};
            this.synthConfig.push(config);
        }

        //setInterval(this.processQueue.bind(this), 10);
    }


    subscribe() {
        // Subscribe to all Mode related callbacks.
        this.socket.on(EVENTS.EVENT_SCORE_PAYLOAD, this.onScoreData.bind(this)); // Save config.
        this.socket.on(EVENTS.EVENT_SYNTH_NOTES, this.onSynthNotes.bind(this)); // Receive piano notes.
        this.socket.on(EVENTS.EVENT_MODE_PAYLOAD, this.onModeData.bind(this)); // Save mode data.
        this.socket.on(EVENTS.EVENT_FULL_DATABASE_PAYLOAD, this.onRequestForFullDatabase.bind(this));
    }

    onRequestForFullDatabase(data) {
        console.log('Event: Request for full database received.');      
        // We alread the light configs stored from before.
        const payload = this.lightConfigs; 
        this.socket.emit(EVENTS.EVENT_FULL_DATABASE_PAYLOAD, payload)
    }

    // This goes directly to all the connected clients who are connected here.
    onSynthNotes(data) {
        data = JSON.parse(data);
        const index = data[0];
        const newValue = data[1];
        const socketId = data[2];
        const configAtIndex = this.synthConfig[index]; 
        if (configAtIndex['val'] === 0 && newValue === 1) {
            configAtIndex['socketId'] = socketId; 
            configAtIndex['val'] = newValue;
            this.synthConfig[index] = configAtIndex; 
            console.log(this.synthConfig);
            this.io.of('/app').emit(EVENTS.EVENT_SYNTH_NOTES, this.synthConfig);
        } else if (configAtIndex['val'] === 1 && newValue === 0) {
            if (configAtIndex['socketId'] === socketId) {
                const newConfig = {'socketId': '', 'val': 0};
                this.synthConfig[index] = newConfig;
                console.log(this.synthConfig); 
                this.io.of('/app').emit(EVENTS.EVENT_SYNTH_NOTES, this.synthConfig);
            }
        }
    }

    cleanSynthConfig(isDefaultConfig) {
        if (isDefaultConfig) {
            console.log('Cleaning Synth Config: Default');
            for (let i = 0; i < 24; i++) {
                const config = {'socketId': '', 'val' : 0};
                this.synthConfig.push(config);
            }
        } else {
            console.log('Cleaning Synth Config for ' + this.socket.id);
            for (let i = 0; i < this.synthConfig.length; i++) {
                const socketIdFromConfig = this.synthConfig[i]['socketId'];
                if (socketIdFromConfig === this.socket.id) {
                    const config = {'socketId': '', val: 0};
                    this.synthConfig[i] = config;
                }
            }
        }

        console.log(this.synthConfig);
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

    onScoreData(data) {
        console.log('New Score data received.');
        let promise = database.saveData(data);
        promise.then(payload => {
            if (this.sequencer.isRunning()) { // At this time, sequencer will absolutely exist!!
                // Send this new payload to other connected clients.
                let parsedPayload = JSON.parse(payload['config']);
                let configPayload = {'index': payload['index'], 'config': parsedPayload};
                //this.io.of('/app').emit(EVENTS.EVENT_FULL_PAYLOAD, configPayload);
               
                // Update sequencer with this new score data.
                console.log("New score data. Updating sequencer.");
                this.sequencer.updateCurrentConfig(configPayload); 
                
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

    getLightConfigs() {
        return this.lightConfigs;
    }

    setCurrentMode(newMode) {
        // Let the managers know what mode I'm currently in.
        // this.sequencer.setCurrentMode(newMode);
        this.dreamManager.setCurrentMode(newMode);
        this.scoreManager.setCurrentMode(newMode);

        // Now do something based on the modes with the sequncer.
        switch (newMode) {
            case MODES.SYNTH: {
                console.log('New Mode: Synth');
                // Turn off the sequencer.
                this.checkAndStopSequencer();
                // Turn off the sweeper.
                this.checkAndStopSweeper();

                // Reset the current synth config completely. 
                this.synthConfig = [];
                for (let i = 0; i < 24; i++) {
                    const config = {'socketId': '', 'val' : 0};
                    this.synthConfig.push(config);
                }

                this.payloadPackager.clearLightsPayloadAndEmit();

                // Send the current Synth config to the clients. 
                this.io.of('/app').emit(EVENTS.EVENT_SYNTH_NOTES, this.synthConfig);
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