// Name: DatabaseParamStore.js
// Author: Amay Kataria. 
// Date: 02/19/2022
// Description: This data store is responsible to hold bpm, all 48 lights and number of entries.
// This data will be stored in the database. Components that need this data will subscribe to this store.  

import Websocket from "../components/Websocket";

export const LIGHT_TYPE = {
    TOP: 'TOP',
    BOTTOM: 'BOTTOM'
};

export const LIGHT_STATE = {
    ON: 1,
    OFF: 0
};

const NUM_LIGHTS = 24;

class LightConfigStore {
    constructor() {
        // Listeners for this database. 
        this.listeners = []; 

        this.bpm = 0;
        this.lightConfig = [];
        // Default light config for 24 lights. 
        this.prepareDefaultLightConfig();
    }

    subscribe(listener) {
        this.listeners.push(listener); 
        const removeListener = () => {
            this.listeners = this.listeners.filter((s) => listener !== s);
        };

        return removeListener;
    }

    // Default config for 24 lights. 
    prepareDefaultLightConfig() {
        for (let i = 0; i < NUM_LIGHTS; i++) {
            let topVal = this.getRandomInt(2);
            let bottomVal = this.getRandomInt(2); 
            let c = {'TOP': topVal, 'BOTTOM': bottomVal};
            this.lightConfig.push(c); 
        }
    }

    // Get the state at a specific index. 
    getState(i) {
        return this.lightConfig[i];
    }

    // Update the state at a specific index. 
    setState(i, lightType, lightState) {
        this.lightConfig[i][lightType] = lightState; 
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}

export default new LightConfigStore();