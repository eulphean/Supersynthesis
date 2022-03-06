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

const MAX_PATTERNS = 5;
const NUM_LIGHTS = 24;
const LOAD_NEW_PAYLOAD_TIME = 500; // 250 milliseconds. 
const PATTERN_CHANGE_TIME = 1000;
const MAX_RANDOM_NOTES = 24; 

class Sequencer {
    constructor(io) {
        // Light Manager instance. 
        this.lightManager = new LightManager(io); 

        // Handy variables for the sequencer.
        this.timerId = ''; 
        this.curPattern = PATTERN.SPLIT; 
        this.prevPattern = PATTERN.SPLIT; 
        this.intervalTime = ''; 
        this.glider = 0; 
        this.gliderA = -1; 
        this.gliderB = -1; 

        this.randomNoteIdx = 0; 
        this.randomList = []; 

        // Set a new pattern to make sure initial values are
        // correct for each pattern. 
        this.chooseNewPattern(); 
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
        let patternChanged; 
        switch (this.curPattern) {
            case PATTERN.FORWARD: 
            {
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
                if (this.randomNoteIdx === MAX_RANDOM_NOTES) {
                    this.lightManager.sendResetPayload();
                    this.chooseNewPattern();
                    patternChanged = true; 
                } else {
                    // Get a random index. 
                    this.calcRandomIndex(); 
                    this.lightManager.createPayloadAndEmit(this.gliderA);
                    this.randomNoteIdx++; 
                    patternChanged = false; 
                }
                return patternChanged; 
            }

            // This will give us some polyphony for multiple notes
            // being played together. 
            case PATTERN.SPLIT: {
                // GliderA is going left, GliderB is going right.
                if (this.gliderA < 0 && this.gliderB === NUM_LIGHTS) {
                    this.lightManager.sendResetPayload(); 
                    this.chooseNewPattern();
                    patternChanged = true; 
                } else {
                    // Send two gliders together.
                    this.lightManager.createPayloadAndEmit(this.gliderA, this.gliderB); 
                    this.gliderA--;
                    this.gliderB++; 
                    patternChanged = false; 
                }
                break;
            }

            // This will give us some polyphony for multiple notes being 
            // played together. 
            case PATTERN.MERGE: {
                // GliderA is going right, GliderB is going left. 
                if (this.gliderA > this.gliderB) {
                    this.lightManager.sendResetPayload();
                    this.chooseNewPattern();
                    patternChanged = true; 
                } else {
                    this.lightManager.createPayloadAndEmit(this.gliderA, this.gliderB);
                    this.gliderA++;
                    this.gliderB--; 
                    patternChanged = false; 
                }
                break; 
            }
        }
    }
    
    setRandomPattern() {
        this.curPattern = this.getRandom(MAX_PATTERNS); 
        while (this.curPattern === this.prevPattern) {
            this.curPattern = this.getRandom(MAX_PATTERNS)
        }
        this.prevPattern = this.curPattern; 
    }

    chooseNewPattern() {
        this.setRandomPattern(); 

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
                // Reset current index of the number of random
                // notes picked. 
                this.randomNoteIdx = 0;
                this.randomList = [];
                break;
            }

            case PATTERN.SPLIT: {
                // Reset gliderA and gliderB.
                let middle = NUM_LIGHTS / 2;
                this.gliderA = middle; 
                this.gliderB = middle -1; 
                break; 
            }

            case PATTERN.MERGE: {
                this.gliderA = 0; 
                this.gliderB = NUM_LIGHTS; 
                break; 
                // Choose where to start. 
            }
        }
    }
    
    calcRandomIndex() {
        // Glider A = main random index.
        // Glider B = saved as previous random index. 
        this.gliderA = this.getRandom(24);
        while ((this.gliderA === this.gliderB) || this.randomList.includes(this.gliderA)) 
        {
            this.gliderA = this.getRandom(24);
        }
        // Finally a good random number, save it.
        this.gliderB = this.gliderA; 
        this.randomList.push(this.gliderA); 
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

    getRandom(max) {
        return Math.floor(Math.random() * max);
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