// Name: FullDbConfigStore.js
// Author: Amay Kataria. 
// Date: 04/25/2024
// Description: A data store to store all the light config entries received from the supersynth database. 

import Websocket from "../components/Websocket";
class FullDbConfigStore {
    constructor() {
        // An array of all the light configs received from the Database.
        this.allLightConfigs = [];
        this.allLightConfigsSubscriber = [];
    }

    getLightConfigs(callback) {
        if (this.allLightConfigs.length > 0) {
            callback();
        } else {
            this.allLightConfigsSubscriber.push(callback);
            Websocket.fetchLightConfigs();
        }
    }

    setLightConfigs(data) {
        this.allLightConfigs = data; 
        if (this.allLightConfigsSubscriber.length > 0) {
            this.allLightConfigsSubscriber.forEach(c => c());
        }
    }
}

export default new FullDbConfigStore();