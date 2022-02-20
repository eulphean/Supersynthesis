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

const NUM_LIGHTS = 24;

class LightConfigStore {
    constructor() {
        // Listeners for this database. 
        this.lightSubscribers = []; 
        this.infoSubscribers = [];

        // Default values. 
        this.configIndex = 0; 
        this.bpm = 0;
        this.lightConfig = [];

        // Default light config for 24 lights. 
        this.prepareDefaultLightConfig();
    }

    subscribeLights(listener) {
        console.log('Subscribe Lights');
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

    // Default config for 24 lights. 
    prepareDefaultLightConfig() {
        console.log('Preparing default config.');
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

    // Increment the config index because this will be a new entry.
    getPayloadForDatabase() {
        // Bad assumption that this call will be successful. 
        this.configIndex += 1; 
        this.json = {}
        this.json['bpm'] = this.bpm; 
        this.json['lights'] = this.lightConfig;
        this.json['time'] = Date();

        console.log(this.lightConfig);
        let payload = {
            'index' : this.configIndex, 
            'config': JSON.stringify(this.json)
        }

        // Trigger info subscribers. 
           for (let i = 0; i < this.infoSubscribers.length; i++) {
            this.infoSubscribers[i]();
        }

        console.log('Sending data with index: ' + this.configIndex);
        return payload;
    }

    setPayloadFromDatabase(payload) {
        console.log('Overwriting current config.');

        this.configIndex = payload['index'];
        console.log('Current Index: ' + this.configIndex);

        // Config elements. 
        let config = payload['config'];
        this.bpm = config['bpm'];

        // Trigger info subscribers. 
        for (let i = 0; i < this.infoSubscribers.length; i++) {
            this.infoSubscribers[i]();
        }

        console.log(payload);
        // Light data is an array. Update the current light
        // config with this incoming data. 
        let lightData = config['lights'];
        for (let i = 0; i < lightData.length; i++) {
            let configState = lightData[i];
            this.lightConfig[i] = configState;
        }

        // Trigger light subscribers.
        for (let i = 0; i < this.lightSubscribers.length; i++) {
            this.lightSubscribers[i]();
        }
    }
}

export default new LightConfigStore();