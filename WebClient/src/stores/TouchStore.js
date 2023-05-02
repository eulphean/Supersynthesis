// Name: TouchStore.js
// Author: Amay Kataria. 
// Date: 05/2/2023
// Description: A simple data store that registers an array of all touch events that are
// registered in the application. This is exclusively useful to implement the synth mode. 

class TouchStore {
    constructor() {
        this.touches = []; 
    }

    setTouches(newTouches) {
        this.touches = newTouches; 
    }

    getTouches() {
        return this.touches;
    }
}

export default new TouchStore();