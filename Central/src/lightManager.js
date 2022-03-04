// Author: Amay Kataria
// Date: 02/15/2022
// File: lightManager.js
// Description: Helper module to format the light data properly that is sent across multiple clients. 
const EVENT_SEQUENCER_PAYLOAD = 'event_sequencer_payload';

class LightManager {
    constructor(io) {
        this.io = io; 

        // Current light configuration on the server. 
        // This is the last entry stored in the database.
        this.serverLights = []; 

        // Temporary client light state populated by the sequencer. 
        this.clientLightState = [];
    }

    updateLights(payload) {
        this.serverLights = [];
        let lightData = payload['lights'];
        lightData.forEach(d => this.serverLights.push(d));
        
        // Payload that goes to the client. 
        this.clearClientLightState(); 
    }

    clearClientLightState() {
        this.clientLightState = []; 
    }

    createPayloadAndEmit(curIdx) {
        let lightState = this.serverLights[curIdx];
        let state = { 'idx' : curIdx, 'val': lightState }; 
        this.clientLightState.push(state);
        let payload = { 'state': this.clientLightState };
        this.io.of('/app').emit(EVENT_SEQUENCER_PAYLOAD, payload); 
    }


    sendResetPayload() {
        let payload = { state: 'NONE' };
        this.io.of('/app').emit(EVENT_SEQUENCER_PAYLOAD, payload); 
        // Clear the client's light state. 
        this.clearClientLightState();
    }
}

module.exports = LightManager;