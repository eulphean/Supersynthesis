// Author: Amay Kataria
// Date: 04/24/2023
// File: ModeHandler>.js
// Description: A CommonManager for all the mode managers that we have. This gives them all the information they need
// to do things (sequencer, io, lightConfigs, currentSocket, currentMode)

class CommonManager {
    constructor(io, sequencer) {
        this.io = io;
        this.sequencer = sequencer; 
        this.lightConfigs = '';
        this.currentSocket = '';
        this.currentConfig = ''; 
    }

    setLightConfigs(lightConfigs) {
        this.lightConfigs = lightConfigs;
    }

    setCurrentSocket(currentSocket) {
        this.socket = currentSocket; 
    }

    setCurrentMode(newMode) {
        this.currentMode = newMode; 
    }
}

module.exports = CommonManager; 