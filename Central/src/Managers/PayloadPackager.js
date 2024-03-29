// Author: Amay Kataria
// Date: 02/15/2022
// File: PayloadPackager.js
// Description: Helper module to format and package light data to be sent out to the clients. 
// Used by Sequencer and Sweeper
const EVENTS = require('./CommonTypes').EVENTS;

class PayloadPackager {
    constructor(io) {
        this.io = io; 

        // Current light configuration on the server. 
        // This is the last entry stored in the database.
        this.currentLightConfig = []; 

        // Final light payload that is emitted to the clients.
        // This data is understood by the raspberry pi and the web client to 
        // interpret on the screen.
        this.clientLightPayload = [];
    }

    clearClientLightState() {
        this.clientLightPayload = []; 
    }

    // Create the payload for the Sweeper.
    createSweeperPayloadAndEmit(gliderA, gliderB) {
        // Reused the logic from the sequencer to do this.
        const state = []
        // GliderA
        state.push({'idx' : gliderA, 'val': 1});
        
        // GliderB
        if (gliderB) {
            state.push({'idx' : gliderB, 'val': 1});
        }

        this.clientLightPayload.push(state);
        let payload = { 'state' : this.clientLightPayload }
        this.io.of('/app').emit(EVENTS.EVENT_SEQUENCER_PAYLOAD, payload); 
    }

    // isFullFlash is a boolean flag indicating the kind of flash payload we should load.
    createSweeperFlashPayload(isFullFlash, side) {
        const state = []; 
        if (isFullFlash) {
            for (let i = 0; i < 24; i++) {
                state.push({'idx' : i, 'val': 1});
            }
        } else {
            const left = side % 2 === 0; 
            if (left) {
                for (let i = 0; i < 12; i++) {
                    state.push({'idx' : i, 'val': 1});
                }
            } else {
                for (let i = 13; i < 24; i++) {
                    state.push({'idx' : i, 'val': 1});
                }
            }
        }

        this.clientLightPayload.push(state);
        let payload = { 'state' : this.clientLightPayload }
        this.io.of('/app').emit(EVENTS.EVENT_SEQUENCER_PAYLOAD, payload); 
    }

    // Updates the current light config used by sequencer to create the right payload for Dream and Score states.
    updateLightConfigForSequencer(config) {
        this.currentLightConfig = [];
        const lightData = config['lights'];
        lightData.forEach(d => this.currentLightConfig.push(d));
        
        // Clear the payload going to the client.
        this.clearClientLightState(); 
    }

    // Create the payload for the Sequencer.
    createSequencerPayloadAndEmit(gliderA, gliderB = undefined) {
        let lightState; 
        let state = []; 
        lightState = this.currentLightConfig[gliderA];
        state.push({'idx' : gliderA, 'val': lightState});

        if (gliderB) {
            lightState = this.currentLightConfig[gliderB];
            state.push({'idx' : gliderB, 'val': lightState});
        }

        this.clientLightPayload.push(state);

        let payload = { 'state': this.clientLightPayload };
        this.io.of('/app').emit(EVENTS.EVENT_SEQUENCER_PAYLOAD, payload); 
    }

    newLightConfigAndEmit(newConfig) {
        // Send all the connected clients including the sender.
        this.io.of('/app').emit(EVENTS.EVENT_FULL_PAYLOAD, newConfig); 
        this.clearClientLightState();
    }

    clearLightsPayloadAndEmit() {
        let payload = { state: 'NONE' };
        this.io.of('/app').emit(EVENTS.EVENT_SEQUENCER_PAYLOAD, payload); 
        // Clear the client's light state. 
        this.clearClientLightState();
    }
}

module.exports = PayloadPackager;