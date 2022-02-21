// Name: DatabaseParamStore.js
// Author: Amay Kataria. 
// Date: 02/19/2022
// Description: This data store is responsible to hold bpm, all 48 lights and number of entries.
// This data will be stored in the database. Components that need this data will subscribe to this store.  

export const LIGHT_TYPE = {
    TOP: 'TOP',
    BOTTOM: 'BOTTOM'
};

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
        // Listeners for this database. 
        this.lightSubscribers = []; 
        this.infoSubscribers = [];

        // Default values. 
        this.configIndex = 0; 
        this.bpm = 150;
        this.lightConfig = [];

        // Helper value to create default heights. 
        this.maxLightHeight = 0;

        // Default light config for 24 lights. 
        this.prepareDefaultLightConfig();
    }

    subscribeLights(listener) {
        this.lightSubscribers.push(listener); 
        const removeListener = () => {
            this.lightSubscribers = this.lightSubscribers.filter((s) => listener !== s);
        };

        return removeListener;
    }

    subscribeInfo(listener) {
        this.infoSubscribers.push(listener);
        const removeListener = () => {
            this.infoListeners = this.infoSubscribers.filter((s) => listener !== s);
        };

        return removeListener;
    }

    setMaxHeight(height) {
        this.maxLightHeight = height; 
    }

    // Default config for 24 lights. 
    prepareDefaultLightConfig() {
        console.log('Preparing default config.');
        for (let i = 0; i < NUM_LIGHTS; i++) {
            // Create a state object.
            let stateObject = {
                'light': {
                    'TOP': 1, 
                    'BOTTOM': 1
                },
                'draw': {
                    'TOP': false,
                    'BOTTOM': false
                },
                'grow': {
                    'TOP': {
                        'state': GROW_STATE.NONE,
                        'active': false
                    },
                    'BOTTOM': {
                        'state': GROW_STATE.NONE,
                        'active': false
                    }
                },
                'height': {
                    'TOP': 0,
                    'BOTTOM': 0
                }
            }
            this.lightConfig.push(stateObject); 
        }
    }

    getFullConfig(i) {
        return this.lightConfig[i]; 
    }

    // GET/SET light's state. 
    getLightState(i) {
        return this.lightConfig[i]['light'];
    }
    setLightState(i, lightType, lightState) {
        this.lightConfig[i]['light'][lightType] = lightState; 
    }

    // GET/SET light's grow state. 
    getGrowState(i) {
        return this.lightConfig[i]['grow'];
    }
    setGrowState(i, lightType, growState, activeState) {
        this.lightConfig[i]['grow'][lightType]['state'] = growState;
        this.lightConfig[i]['grow'][lightType]['active'] = activeState;
    }

    // GET/SET light's draw state. 
    getDrawState(i) {
        return this.lightConfig[i]['draw'];
    }
    setDrawState(i, lightType, state) {
        this.lightConfig[i]['draw'][lightType] = state;
    }

    // GET/SET light's heights. 
    getHeightState(i) {
        return this.lightConfig[i]['height'];
    }
    setHeightState(i, lightType, height) {
        this.lightConfig[i]['height'][lightType] = height; 
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    getBpm() {
        return this.bpm;
    }
    setBpm(bpm) {
        this.bpm = bpm; 
        // Trigger info subscribers. 
        for (let i = 0; i < this.infoSubscribers.length; i++) {
            this.infoSubscribers[i]();
        }
    }
    getConfigIndex() {
        return this.configIndex;
    }

    // Increment the config index because this will be a new entry.
    getPayloadForDatabase() {
        //Bad assumption that this call will be successful. 
        this.configIndex += 1; 
        let dbConfig = this.filterConfig();
        this.json = {}
        this.json['bpm'] = this.bpm; 
        this.json['lights'] = dbConfig;
        this.json['time'] = Date();

        let payload = {
            'index' : this.configIndex, 
            'config': JSON.stringify(this.json)
        }

        // Trigger info subscribers for new data. 
        for (let i = 0; i < this.infoSubscribers.length; i++) {
            this.infoSubscribers[i]();
        }

        return payload;
    }

    setPayloadFromDatabase(payload) {
        console.log('Overwriting current config.');

        // Get current index. 
        this.configIndex = payload['index'];

        // Config items. 
        let config = payload['config'];
        this.bpm = config['bpm'];

        // Trigger info subscribers. 
        for (let i = 0; i < this.infoSubscribers.length; i++) {
            this.infoSubscribers[i]();
        }
        
        // Light data is an array. Update the current light
        // config with this incoming data. 
        let lightData = config['lights'];
        this.updateLightConfig(lightData);

        // Trigger light subscribers.
        for (let i = 0; i < this.lightSubscribers.length; i++) {
            this.lightSubscribers[i]();
        }
    }

    // Extract the config we need for the database. 
    filterConfig() {
        let dbConfig = []; 
        this.lightConfig.forEach(c => {
            let d = c['light']
            dbConfig.push(d);
        });
        return dbConfig; 
    }

    updateLightConfig(lightData) {
        // Empty the current light config. 
        this.lightConfig = []; 
        
        // Create a new config. 
        for (let i = 0; i < lightData.length; i++) {
            let data = lightData[i];
            let stateObj = {
                'light': {
                    'TOP': data[LIGHT_TYPE.TOP], 
                    'BOTTOM': data[LIGHT_TYPE.BOTTOM]
                },
                // Create the draw states from the incoming light state. 
                'draw': {
                    'TOP': data[LIGHT_TYPE.TOP] === LIGHT_STATE.ON,
                    'BOTTOM': data[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON
                },
                'grow': {
                    'TOP': {
                        'state': GROW_STATE.NONE,
                        'active': false
                    },
                    'BOTTOM': {
                        'state': GROW_STATE.NONE,
                        'active': false
                    }
                },
                // Create the height state from the incoming light state. 
                'height': {
                    'TOP': data[LIGHT_TYPE.TOP] === LIGHT_STATE.ON ? this.maxLightHeight : 0,
                    'BOTTOM': data[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON ? this.maxLightHeight : 0
                }
            }
            this.lightConfig.push(stateObj);
        }
    }
}

export default new LightConfigStore();