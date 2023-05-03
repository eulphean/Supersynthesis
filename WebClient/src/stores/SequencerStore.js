// Name: SequencerStore.js
// Author: Amay Kataria. 
// Date: 03/03/2022
// Description: A data store to keep track of all data coming from the sequencer
// events from the central server. 

import { LIGHT_STATE } from "./LightConfigStore";
const NUM_LIGHTS = 24;

class SequencerStore {
    constructor() {
        this.drawConfig = [];
        this.indices = []; 
    }

    getIndices() {
        return this.indices;
    }

    setSequencerData(payload) {
        this.indices = []; 
        let lightState = payload['state'];
        if (lightState === 'NONE') {
            // Turn off all the lights. 
            for (let i = 0; i < NUM_LIGHTS; i++) {
                this.drawConfig[i] = LIGHT_STATE.OFF;
            }
            this.indices = []; 
        } else {
            for (let i = 0; i < lightState.length; i++) {
                // All data is in an array. 
                let s = lightState[i];
                // Reset indices before
                for (let j = 0; j < s.length; j++) {
                    let idx = s[j]['idx'];
                    let val = s[j]['val'];
                    this.drawConfig[idx] = val; 
                    this.indices[j] = idx; 
                }
            }
        }
    }

    clearConfig() {
        this.drawConfig.length = 0;
    }

    getLightState(i) {
        return this.drawConfig[i];
    }
}

export default new SequencerStore();