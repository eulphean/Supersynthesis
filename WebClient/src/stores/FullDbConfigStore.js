// Name: FullDbConfigStore.js
// Author: Amay Kataria. 
// Date: 04/25/2024
// Description: A data store to store all the light config entries received from the supersynth database. 

import Websocket from "../components/Websocket";
class FullDbConfigStore {
    constructor() {
        // An array of all the light configs received from the Database.
        this.allLightConfigs = [];
        this.allLightConfigsSubscriber = '';
    }

    subscribeForDbConfigs(listener) {
        this.fullDbConfigSubscriber = listener; 
    }

    getLightConfigs() {
        if (this.allLightConfigs.length > 0) {
            return this.allLightConfigs;
        } else {
            Websocket.fetchLightConfigs();
        }
    }

    setLightConfigs(data) {
        this.allLightConfigs = data; 
        if (this.fullDbConfigSubscriber) {
            this.fullDbConfigSubscriber(this.allLightConfigs);
        }
    }
}

export default new FullDbConfigStore();