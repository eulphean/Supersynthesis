// Name: LightConfigStore.js
// Author: Amay Kataria. 
// Date: 02/19/2022
// Description: Core data store for the application that stores the data for all the 24 lights. This data is divided
// into four states: light, height, grow, and draw. These states are responsible for how the lights are drawn and 
// transmitted to the database. 

export const LIGHT_STATE = {
    ON: 1,
    OFF: 0
};

export const GROW_STATE = {
    NONE: 0,
    GROW: 1,
    SHRINK: 2
}

const NUM_LIGHTS = 24;

class LightConfigStore {
    constructor() {
        // Separate config arrays for the 24 lights.
        this.dbLightConfig = []; // What comes from the dB. Don't modify this. 
        this.growConfig = [];
        this.heightConfig = []; 
        this.activeLightConfig = []; // Currently being edited in the app. 

        // Helper value to create default heights. 
        this.maxLightHeight = 0;

        // Default light config for 24 lights. 
        this.prepareDefaultLightConfig();
    }

    setMaxHeight(height) {
        this.maxLightHeight = height; 
    }

    // Default config for 24 lights. 
    prepareDefaultLightConfig() {
        console.log('Preparing default config.');
        for (let i = 0; i < NUM_LIGHTS; i++) {
            // All lights are off by default and are not doing any growth. 
            // Just a simple helper routine.
            let r = Math.round(Math.random());
            let s = r === 0 ? LIGHT_STATE.ON : LIGHT_STATE.OFF; 
            this.dbLightConfig.push(s);
            this.activeLightConfig.push(s); 
            this.growConfig.push({state: GROW_STATE.NONE, active: false});
            this.heightConfig.push(0); 
        }
    }

    getActiveLightConfig() {
        // Return the one that we have been editing. 
        return this.activeLightConfig; 
    }
    // Sets the light config along with other configs that 
    // coming from the server. Overwrite activeLightConfig as well.
    setLightConfig(lightConfig) {
        for (let i = 0; i < lightConfig.length; i++) {
            let lightState = lightConfig[i];
            this.dbLightConfig[i] = lightState; 
            this.activeLightConfig[i] = lightState; 
            this.growConfig[i] = {state: GROW_STATE.NONE, active: false}; // Reset growth on every light. 
            this.heightConfig[i] = (lightState === LIGHT_STATE.ON) ? this.maxLightHeight : 0; 
            // Don't modify Draw State. That is modified by the sequencer event. 
        }
    }

    // Light config from the database. 
    getDbLightState(i) {
        return this.dbLightConfig[i];
    }
    // Light config that is actively being edited. 
    getActiveLightState(i) {
        return this.activeLightConfig[i];
    }
    setActiveLightState(i, lightState) {
        this.activeLightConfig[i] = lightState; 
    }

    // GET/SET light's grow state. 
    getGrowState(i) {
        return this.growConfig[i];
    }
    setGrowState(i, growState, activeState) {
        this.growConfig[i]['state'] = growState;
        this.growConfig[i]['active'] = activeState;
    }

    // GET/SET light's heights. 
    getHeightState(i) {
        return this.heightConfig[i];
    }
    setHeightState(i, height) {
        this.heightConfig[i] = height; 
    }
}

export default new LightConfigStore();