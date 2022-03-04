// Author: Amay Kataria
// Date: 02/15/2022
// File: Sequencer.js
// Description: A custom sequencer module running on the webserver. This sequencer mode can do 
// multiple patterns. Forward, Backward, Random, Split from Center, Merge back in the center. 
// Based on these patterns correct notes are picked and sent to the clients. 
// How do I architect this sequencer in the best way possible? 
// The timing for the sequencer is set by the time coming from the clients. 

var LightManager = require('./lightManager.js');

// States that the sequncer can be in.
const PATTERN = {
    FORWARD: 0,
    BACKWARD: 1,
    RANDOM: 2, 
    SPLIT: 3,
    MERGE: 4
}

const NUM_LIGHTS = 24;
const LOAD_NEW_PAYLOAD_TIME = 300; // 250 milliseconds. 
const PATTERN_CHANGE_TIME = 200;

class Sequencer {
    constructor(io) {
        // Light Manager instance. 
        this.lightManager = new LightManager(io); 

        // Handy variables for the sequencer.
        this.timerId = ''; 
        this.curPattern = PATTERN.FORWARD; 
        this.intervalTime = ''; 
        this.glider = 0; 
        this.gliderA = -1; 
        this.gliderB = -1; 
    }

    begin(payload) {
        this.lightManager.updateLights(payload); 
        // Set in the beginning, then updated only when a new payload is received. 
        this.intervalTime = this.getIntervalTime(payload['bpm']);
        this.handleInterval(payload);
    }

    handleInterval() {
        let patternChanged = this.updateIndex();
        let timeToWait = patternChanged ? PATTERN_CHANGE_TIME : this.intervalTime; 
        this.timerId = setTimeout(this.handleInterval.bind(this), timeToWait); 
    }

    // New message from one of the clients triggers the sequencer to update itself. 
    updateInterval(payload) {
        // Update light manager with this new payload. 
        this.lightManager.updateLights(payload);
        this.clearTimer(); 

        // New time interval for the sequencer. 
        console.log('Update sequencer with a new time interval.');
        this.intervalTime = this.getIntervalTime(payload['bpm']);

        // Wait for new_payload_time during which the intallation will flash
        // before restarting the sequencer. 
        setTimeout(this.handleInterval.bind(this), LOAD_NEW_PAYLOAD_TIME);
    }

    updateIndex() {
        switch (this.curPattern) {
            case PATTERN.FORWARD: 
            {
                let patternChanged; 
                if (this.glider === NUM_LIGHTS) {
                    // We have reached the end, clear the system.
                    this.lightManager.sendResetPayload(); 
                    // Choose a new pattern. 
                    this.chooseNewPattern(); 
                    patternChanged = true; 
                } else {
                    this.lightManager.createPayloadAndEmit(this.glider); 
                    this.glider++; 
                    patternChanged =false; 
                }
                return patternChanged; 
            }

            case PATTERN.BACKWARD: { 
                let patternChanged; 
                if (this.glider < 0) {
                    // We have reached the end, clear the system. 
                    this.lightManager.sendResetPayload();
                    // Choose a new pattern. 
                    this.chooseNewPattern(); 
                    patternChanged = true; 
                } else {
                    this.lightManager.createPayloadAndEmit(this.glider);
                    this.glider--;
                    patternChanged = false; 
                }
                return patternChanged; 
            }

            case PATTERN.RANDOM: {
                // Count certain times. 
                break; 
            }

            // This will give us some polyphony for multiple notes
            // being played together. 
            case PATTERN.SPLIT: {
                // Count certain times to do this. 
                break;
            }

            // This will give us some polyphony for multiple notes being 
            // played together. 
            case PATTERN.MERGE: {
                // Count certain times to do this. 
                break; 
            }
        }
    }

    chooseNewPattern() {
        this.curPattern = Math.round(Math.random()); 
        // this.curPattern = PATTERN.FORWARD; 

        switch (this.curPattern) {
            case PATTERN.FORWARD:
            {
                // Reset back to 0.
                this.glider = 0; 
                break;    
            }

            case PATTERN.BACKWARD: {
                this.glider = NUM_LIGHTS - 1; 
                break; 
            }

            case PATTERN.RANDOM: {
                // Choose starting point
                break;
            }

            case PATTERN.SPLIT: {
                // Choose starting point. 
                break; 
            }

            case PATTERN.MERGE: {
                // Choose where to start. 
            }
        }
    }

    // Helper functions.
    stop() {
        this.clearTimer(); 
    }

    isRunning() {
        return this.timerId !== '';
    }

    clearTimer() {
        if (this.timerId !== '') {
            console.log('Cleaning previous timer: ' + this.timerId);
            clearTimeout(this.timerId); 
            this.timerId = '';
        }
    }

    getIntervalTime(bpm) {
        return Math.floor(60000/bpm); 
    }
}

module.exports = Sequencer;



        // Send light manager all the information required to create a 
        // payload for the clients and emit it to them. 
        // For example, this could include the glider, current pattern, based
        // on which LightManager can create the right light payload and emit it to
        // // the clients. This is very much possible. 
        // let payload = this.lightManager.createPayloadAndEmit(this.glider); 
        // console.log(payload);
        // let timeToWait = payload['state'] === 'NONE' ? OFF_TIME : this.intervalTime; 
        // // Recursive call to handle interval until the timerId is cleared. 