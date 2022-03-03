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
        this.lightConfig = []; 
        this.growConfig = [];
        this.drawConfig = [];
        this.heightConfig = []; 

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
            this.drawConfig.push(s); 
            this.lightConfig.push(s);
            this.growConfig.push({state: GROW_STATE.NONE, active: false});
            this.heightConfig.push(0); 
        }
    }

    getLightConfig() {
        return this.lightConfig; 
    }
    setLightConfig(lightConfig) {
        // Sets the light config along with other configs that 
        // are used for interaction mode. 
        for (let i = 0; i < lightConfig.length; i++) {
            let lightState = lightConfig[i];
            this.lightConfig[i] = lightState; 
            this.growConfig[i] = {state: GROW_STATE.NONE, active: false}; // Reset growth on every light. 
            this.heightConfig[i] = (lightState === LIGHT_STATE.ON) ? this.maxLightHeight : 0; 
            // Don't modify Draw State. That is modified by the sequencer event. 
        }
    }

    setSequencerData(lightData) {
        // This data is coming cleanly from the DB.
        //console.log(lightData);
            //     // let lightState = payload['state'];
    //     // // Turn off all the lights. 
    //     // if (lightState === 'NONE') {
    //     //     for (let i = 0; i < this.drawConfig.length; i++) {
    //     //         this.drawConfig[i] = false;
    //     //     }
    //     // } else {
    //     //     for (let i = 0; i < lightState.length; i++) {
    //     //         let s = lightState[i];
    //     //         let idx = s['idx']; let val = s['val'] === LIGHT_STATE.ON;
    //     //         let type = s['type'];
    //     //         this.drawConfig[idx] = {
    //     //             'type': type,
    //     //             'val': val
    //     //         }; 
    //     //     }
    //     // }
    }

    // GET/SET light's state. 
    getLightState(i) {
        return this.lightConfig[i];
    }
    setLightState(i, lightState) {
        this.lightConfig[i] = lightState; 
    }

    // GET/SET light's grow state. 
    getGrowState(i) {
        return this.growConfig[i];
    }
    setGrowState(i, growState, activeState) {
        this.growConfig[i]['state'] = growState;
        this.growConfig[i]['active'] = activeState;
    }

    // GET/SET light's draw state. 
    getDrawState(i) {
        return this.drawConfig[i];
    }
    setDrawState(i, state) {
        this.drawConfig[i] = state;
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


    // // Increment the config index because this will be a new entry.
    // getPayloadForDatabase() {
    //     // //Bad assumption that this call will be successful. 
    //     // this.configIndex += 1; 
    //     // let dbConfig = this.filterConfig();
    //     // this.json = {}
    //     // this.json['bpm'] = this.localBpm; // Get the current bpm that has been set by the user. 
    //     // this.json['lights'] = dbConfig;
    //     // this.json['time'] = Date();

    //     // let payload = {
    //     //     'index' : this.configIndex, 
    //     //     'config': JSON.stringify(this.json)
    //     // }

    //     // return payload;
    // }

    // setPayloadFromDatabase(payload) {
    //     // console.log('Overwriting current config.');

    //     // // Get current index. 
    //     // this.configIndex = payload['index'];

    //     // // Config items. 
    //     // let config = payload['config'];
    //     // this.bpm = config['bpm'];


    //     // // Trigger info subscribers. 
    //     // for (let i = 0; i < this.infoSubscribers.length; i++) {
    //     //     this.infoSubscribers[i]();
    //     // }
        
    //     // // Light data is an array. Update the current light
    //     // // config with this incoming data. 
    //     // let lightData = config['lights'];
    //     // this.updateLightConfig(lightData);
    // }

    // setLightTimerData(payload) {
    //     // let lightState = payload['state'];
    //     // // Turn off all the lights. 
    //     // if (lightState === 'NONE') {
    //     //     for (let i = 0; i < this.drawConfig.length; i++) {
    //     //         this.drawConfig[i] = false;
    //     //     }
    //     // } else {
    //     //     for (let i = 0; i < lightState.length; i++) {
    //     //         let s = lightState[i];
    //     //         let idx = s['idx']; let val = s['val'] === LIGHT_STATE.ON;
    //     //         let type = s['type'];
    //     //         this.drawConfig[idx] = {
    //     //             'type': type,
    //     //             'val': val
    //     //         }; 
    //     //     }
    //     // }
    // }

    // // Extract the config we need for the database. 
    // filterConfig() {
    //     // let dbConfig = []; 
    //     // this.lightConfig.forEach(c => {
    //     //     let d = c['light']
    //     //     dbConfig.push(d);
    //     // });
    //     // return dbConfig; 
    // }

    // updateLightConfig(lightData) {
    //     // // Empty the current light config. 
    //     // this.lightConfig = []; 
        
    //     // // Create a new config. 
    //     // for (let i = 0; i < lightData.length; i++) {
    //     //     let data = lightData[i];
    //     //     let stateObj = {
    //     //         'light': {
    //     //             'TOP': data[LIGHT_TYPE.TOP], 
    //     //             'BOTTOM': data[LIGHT_TYPE.BOTTOM]
    //     //         },
    //     //         'grow': {
    //     //             'TOP': {
    //     //                 'state': GROW_STATE.NONE,
    //     //                 'active': false
    //     //             },
    //     //             'BOTTOM': {
    //     //                 'state': GROW_STATE.NONE,
    //     //                 'active': false
    //     //             }
    //     //         },
    //     //         // Create the height state from the incoming light state. 
    //     //         'height': {
    //     //             'TOP': data[LIGHT_TYPE.TOP] === LIGHT_STATE.ON ? this.maxLightHeight : 0,
    //     //             'BOTTOM': data[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON ? this.maxLightHeight : 0
    //     //         }
    //     //     }
    //     //     this.lightConfig.push(stateObj);
    //     // }
    // }