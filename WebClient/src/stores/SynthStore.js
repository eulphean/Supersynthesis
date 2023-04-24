// Name: SynthStore.js
// Author: Amay Kataria
// Date: 04/24/2023
// Description: This data store is responsible to store, transmit, and receive 

class SynthStore {
    constructor() {
        this.subscribers = [];
        this.currentState = Array(24).fill(0);
    }

    subscribe(listener) {
        this.subscribers.push(listener);
    }

    setSynthNotes(newState) {
        this.currentState = newState; 
        this.subscribers.forEach(l => {
            l(this.currentState);
        });
    }
}

export default new SynthStore(); 