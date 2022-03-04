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
        this.curIdx = -1; 
    }

    getCurIndex() {
        return this.curIdx;
    }

    setSequencerData(payload) {
        let lightState = payload['state'];
        if (lightState === 'NONE') {
            // Turn off all the lights. 
            for (let i = 0; i < NUM_LIGHTS; i++) {
                this.drawConfig[i] = LIGHT_STATE.OFF;
            }
            // Sequencer is off. 
            this.curIdx = -1; 
        } else {
            for (let i = 0; i < lightState.length; i++) {
                let s = lightState[i];
                let idx = s['idx']; let val = s['val'];
                this.drawConfig[idx] = val; 
            }

            let item = lightState[lightState.length - 1]; 
            this.curIdx = item['idx'];

            // // lightState is an array of all the values that the sequencer has 
            // // covered until now on the server. So the current index of the sequencer
            // // is lightState's length - 1. 
            // let direction = payload['direction'];
            // if (direction === 'RIGHT') {
            
            // } 

            // if (direction === 'LEFT') {
            //     this.curIdx = NUM_LIGHTS - lightState.length;
            // }
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