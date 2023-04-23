// Author: Amay Kataria
// Date: 04/22/2023
// File: ModeHandler>.js
// Description: Module to handle all the modes that Backend application can be. Currently, there are 4 modes
// that the application is using: 0: Synth, 1: Dream, 2: Score, 3: Sweep. Based on the these modes, the application 
// uses the Sequnecer, etc to do things. 
var Sequencer = require('../Sequencer/Sequencer.js'); 
var database = require('../database.js');

const EVENT_FULL_PAYLOAD = 'event_full_payload';
const EVENT_SYNTH_NOTES = 'event_synth_notes';
const EVENT_MODE_PAYLOAD = 'event_mode_payload';
const EVENT_SAVE_PAYLOAD = 'event_save_payload';

class ModeHandler {
    constructor(io) {
        this.io = io; 
        this.sequencer = new Sequencer(io);
        this.currentMode = '';
        this.socket = ''; 
    }

    subscribe() {
        // Subscribe to all Mode related callbacks.
        this.socket.on(EVENT_SAVE_PAYLOAD, this.onSaveData.bind(this)); // Save config.
        this.socket.on(EVENT_SYNTH_NOTES, this.onSynthNotes.bind(this)); // Receive piano notes.
        this.socket.on(EVENT_MODE_PAYLOAD, this.onModeData.bind(this)); // Save mode data.
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
        this.io.of('/app').emit(EVENT_SYNTH_NOTES, parsedPayload);
    }

    onModeData(data) {
        console.log('New Mode Received.');
        // Commit to the database.
        // Forward this to other clients that are connected.
        let promise = database.updateModeData(data);
        promise.then(payload => {
            this.io.of('/app').emit(EVENT_MODE_PAYLOAD, payload);
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

    setCurrentMode(mode) {
        this.currentMode = mode;
        console.log('Current Mode: ' + this.currentMode);

        // Now do something based on the modes with the sequncer.
        switch (this.currentMode) {
            case 0: {
                console.log('Current Mode: Synth');
                // Turn off the sequencer since we'll be processing the piano events.
                this.sequencer.stop();
                break;
            }

            case 1: {
                console.log('Current Mode: Dream');
                // Subscribe a callback, so I can load a new dream config.

                const numEntries = this.lightConfigs.length; 
                const randIdx = Math.floor(Math.random() * numEntries); 
                const randConfig = this.lightConfigs[randIdx]['config'];

                if (!this.sequencer.isRunning()) {
                    this.sequencer.begin(randConfig);
                } else {
                    this.sequencer.updateInterval(randConfig);
                }

                this.socket.emit(EVENT_FULL_PAYLOAD, randConfig);
                // Turn on the sequencer
                // After every message, send it a new dream message
                break;
            }

            case 2: {
                console.log('Current Mode: Score');
                if (this.lightConfigs.length > 0) {
                    // Read the first payload entry and show it in the sequencer
                    const firstConfig = this.lightConfigs[0];
                    // Send this config to the app (socket) that just connected.
                    this.socket.emit(EVENT_FULL_PAYLOAD, firstConfig);
                    // Is there a sequencer already running? 
                    if (this.sequencer.isRunning()) {
                        console.log('Sequencer already running. Do nothing!!');
                    } else {
                        console.log('Sequencer is not running. Start it!!');
                        this.sequencer.begin(firstConfig['config']);
                    }
                }
                break;
            }

            case 3: {
                console.log('Current Mode: Sweep');
                // Turn off the sequencer
                // Create a custom score module to handle this
                break;
            }

            default: {
                console.log('Default');
                break;
            }
        }


        // Emit the current mode to the app (socket) that just connected.
        this.socket.emit(EVENT_MODE_PAYLOAD, mode);
    }

}

module.exports = ModeHandler;