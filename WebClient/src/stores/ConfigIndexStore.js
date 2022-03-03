// Name: ConfigIndexStore.js
// Author: Amay Kataria
// Date: 03/03/2022
// Description: This data store is responsible to store the current config index on top
// of which the user is actually drawing the pattern. 

class ConfigIndexStore {
    constructor() {
        // Default values. 
        this.configIndex = 0; 
        this.subscriber = ''; 
    }

    getConfigIndex() {
        return this.configIndex; 
    }

    subscribe(listener) {
        this.subscriber = listener; 
    }

    setConfigIndex(newConfigIndex) {
        this.configIndex = newConfigIndex;
        // Let subscriber know we have updates. 
        this.subscriber(); 
    }
}

export default new ConfigIndexStore(); 