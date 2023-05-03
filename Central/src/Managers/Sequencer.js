// Author: Amay Kataria
// Date: 02/15/2022
// File: Sequencer.js
// Description: A custom sequencer module running on the webserver. This sequencer mode can do 
// multiple patterns. Forward, Backward, Random, Split from Center, Merge back in the center. 
// Based on these patterns correct notes are picked and sent to the clients. 
// How do I architect this sequencer in the best way possible? 
// The timing for the sequencer is set by the time coming from the clients. 

// States that the sequncer can be in.
const PATTERN = {
    FORWARD: 0,
    SPLIT: 1,
    RANDOM: 2, 
    BACKWARD: 3,
    MERGE: 4
}

const MAX_PATTERNS = 5;
const NUM_LIGHTS = 24;
const LOAD_NEW_PAYLOAD_TIME = 500; // 250 milliseconds. 
const PATTERN_CHANGE_TIME = 1500;
const MAX_RANDOM_NOTES = 24; 

class Sequencer {
    constructor(payloadPackager) {
        // Light Manager instance. 
        this.payloadPackager = payloadPackager;

        // Keep track of the current mode.
        this.currentMode = '';

        // Handy variables for the sequencer.      
        // Best is to keep an array of timers, so they can be cleaned up properly.   
        this.timerIds = []
        this.curPattern = PATTERN.SPLIT; 
        this.prevPattern = PATTERN.SPLIT; 
        this.intervalTime = ''; 
        this.glider = 0; 
        this.gliderA = -1; 
        this.gliderB = -1; 

        this.randomNoteIdx = 0; 
        this.randomList = []; 

        this.count = 0;

        // Callback to track how many times a sequence has been run.
        // Useful for Dream State
        this.incrementSequenceCountCallback = '';

        // Set a new pattern to make sure initial values are
        // correct for each pattern. 
        this.chooseNewPattern(); 
    }

    setIncrementSequenceCountCallback(callback) {
        this.incrementSequenceCountCallback = callback;
    }

    begin(lightConfig) {    
        console.log('Sequencer: Begin');
        // Choose from a new pattern. 
        this.chooseNewPattern(); 

        const config = lightConfig['config'];
        this.payloadPackager.updateLightConfigForSequencer(config); 
        this.payloadPackager.newLightConfigAndEmit(lightConfig);

        // Set in the beginning, then updated only when a new payload is received. 
        this.intervalTime = this.getIntervalTime(config['bpm']);
        this.handleInterval();
    }

    handleInterval() {
        // Has state changed during this time? If yes, turn off the sequencer. 
        let patternChanged = this.updateSequencer();
        let configUpdated = false;
        if (patternChanged) {
            // Call the callback to check if it's time to update the config.
            // Based on that we can take the next steps.
            if (this.incrementSequenceCountCallback) {
                configUpdated = this.incrementSequenceCountCallback();
            }
        }

        if (!configUpdated) {
            let timeToWait = patternChanged ? PATTERN_CHANGE_TIME : 1000;         
            const timerId = setTimeout(this.handleInterval.bind(this), timeToWait); 
            this.timerIds.push(timerId);
        }
    }

    // New message from one of the clients triggers the sequencer to update itself. 
    updateCurrentConfig(lightConfig) {
        const config = lightConfig['config'];

        // Clear sequrncer
        this.chooseNewPattern();
        this.clearTimer(); 

        // Update light manager with this new payload. 
        this.payloadPackager.updateLightConfigForSequencer(config);
        this.payloadPackager.newLightConfigAndEmit(lightConfig);

        // New time interval for the sequencer. 
        console.log('Update sequencer with a new time interval.');
        console.log('New BPM: ' + config['bpm']);

        this.intervalTime = this.getIntervalTime(config['bpm']);
        console.log('New Interval Time: ' + this.intervalTime);

        // Wait for new_payload_time during which the intallation will flash
        // before restarting the sequencer. 
        const timerId = setTimeout(this.handleInterval.bind(this), LOAD_NEW_PAYLOAD_TIME);
        this.timerIds.push(timerId);
    }

    updateSequencer() {
        let patternChanged; 
        switch (this.curPattern) {
            case PATTERN.FORWARD: 
            {
                if (this.glider === NUM_LIGHTS) {
                    // We have reached the end, clear the system.
                    this.payloadPackager.clearLightsPayloadAndEmit(); 
                    // Choose a new pattern. 
                    this.chooseNewPattern(); 
                    patternChanged = true; 
                } else {
                    this.payloadPackager.createSequencerPayloadAndEmit(this.glider); 
                    this.glider++; 
                    patternChanged = false; 
                }
                return patternChanged; 
            }

            case PATTERN.BACKWARD: {                
                if (this.glider < 0) {
                    // We have reached the end, clear the system. 
                    this.payloadPackager.clearLightsPayloadAndEmit();
                    // Choose a new pattern. 
                    this.chooseNewPattern(); 
                    patternChanged = true; 
                } else {
                    this.payloadPackager.createSequencerPayloadAndEmit(this.glider);
                    this.glider--;
                    patternChanged = false; 
                }
                return patternChanged; 
            }

            case PATTERN.RANDOM: {
                if (this.randomNoteIdx === MAX_RANDOM_NOTES) {
                    this.payloadPackager.clearLightsPayloadAndEmit();
                    this.chooseNewPattern();
                    patternChanged = true; 
                } else {
                    // Get a random index. 
                    this.calcRandomIndex(); 
                    this.payloadPackager.createSequencerPayloadAndEmit(this.gliderA);
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
                    this.payloadPackager.clearLightsPayloadAndEmit(); 
                    this.chooseNewPattern();
                    patternChanged = true; 
                } else {
                    // Send two gliders together.
                    this.payloadPackager.createSequencerPayloadAndEmit(this.gliderA, this.gliderB); 
                    this.gliderA--;
                    this.gliderB++; 
                    patternChanged = false; 
                }
                return patternChanged;
            }

            // This will give us some polyphony for multiple notes being 
            // played together. 
            case PATTERN.MERGE: {
                // GliderA is going right, GliderB is going left. 
                if (this.gliderA > this.gliderB) {
                    this.payloadPackager.clearLightsPayloadAndEmit();
                    this.chooseNewPattern();
                    patternChanged = true; 
                } else {
                    this.payloadPackager.createSequencerPayloadAndEmit(this.gliderA, this.gliderB);
                    this.gliderA++;
                    this.gliderB--; 
                    patternChanged = false; 
                }
                return patternChanged;
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
        // Reset all vals first.
        this.glider = 0; 
        this.gliderA = -1; 
        this.gliderB = -1; 

        this.randomNoteIdx = 0; 
        this.randomList = []; 
        
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
                this.gliderB = NUM_LIGHTS - 1; 
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
        console.log('Stop Sequencer');
        this.payloadPackager.clearLightsPayloadAndEmit();
        this.clearTimer(); 
    }

    isRunning() {
        return this.timerId !== '';
    }

    clearTimer() {
        this.timerIds.forEach(t => {
            const p = this.timerIds.pop();
            clearTimeout(p);
        });
        this.timerIds = []; 
    }

    getIntervalTime(bpm) {
        return Math.floor(60000/bpm); 
    }

    getRandom(max) {
        return Math.floor(Math.random() * max);
    }
}

module.exports = Sequencer;
