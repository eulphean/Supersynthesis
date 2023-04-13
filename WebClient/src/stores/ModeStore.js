// Name: ModeStore.js
// Author: Amay Kataria
// Date: 04/13/2023
// Description: This data store is responsible to store the current mode (Synth, Dream, Score, or Sweep)
// that the installation is currently in.

import Websocket from "../components/Websocket";

// Use these enum denominations throughout.
export const MODE = {
    SYNTH: 0,
    DREAM: 1, 
    SCORE: 2, 
    SWEEP: 3
};

class ModeStore {
    constructor() {
        // What is the default mode? 
        this.currentMode = MODE.SYNTH; 

        // Fire this when the mode is changing or something is happenign.
        this.subscribers = [];
    }

    subscribe(listener) {
        this.subscribers.push(listener);
    }

    getCurrentMode() {
        return this.currentMode; 
    }

    setMode(newMode) {
        if (this.currentMode !== newMode) {
            // Set the mode
            this.currentMode = newMode;
    
            // Let subscribers know new Bpm values are updated. 
            this.subscribers.forEach(l => {
                l(newMode);
            });
    
            // Commit this data to the database.
            Websocket.commitModeData();
        }
    }
}

export default new ModeStore(); 