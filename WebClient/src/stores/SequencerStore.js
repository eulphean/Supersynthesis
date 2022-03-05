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
        let lightState = payload['state'];
        if (lightState === 'NONE') {
            // Turn off all the lights. 
            for (let i = 0; i < NUM_LIGHTS; i++) {
                this.drawConfig[i] = LIGHT_STATE.OFF;
            }
            this.indices = []; 
        } else {
            for (let i = 0; i < lightState.length; i++) {
                let s = lightState[i];
                // Handle multiple gliders. 
                if (Array.isArray(s)) {
                    let a = s[0];
                    let b = s[1]; 
                    this.drawConfig[a['idx']] = a['val'];
                    this.drawConfig[b['idx']] = b['val'];

                    // Merge or split. 
                    this.indices[0] = a['idx'];
                    this.indices[1] = b['idx']; 
                } else {
                    // Only a single glider. 
                    let idx = s['idx']; let val = s['val'];
                    this.drawConfig[idx] = val; 
                    this.indices[0] = idx; 
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