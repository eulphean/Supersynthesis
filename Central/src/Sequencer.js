// Author: Amay Kataria
// Date: 02/15/2022
// File: Sequencer.js
// Description: A custom sequencer module running on the webserver. This sequencer mode can do 
// multiple patterns. Forward, Backward, Random, Split from Center, Merge back in the center. 
// Based on these patterns correct notes are picked and sent to the clients. 
// How do I architect this sequencer in the best way possible? 
// The timing for the sequencer is set by the time coming from the clients. 

const PATTERN = {
    FORWARD: 0,
    BACKWARD: 1,
    RANDOM: 2, 
    SPLIT: 3,
    MERGE: 4
}

const NUM_LIGHTS = 4;

class Sequencer {
    constructor() {
        this.timerId = ''; 
        this.curPattern = PATTERN.FORWARD; 
        this.glider = -1; 
        this.gliderA = -1; 
        this.gliderB = -1; 
    }

    begin() {
        let intervalTime = 1000; 
        setTimeout(this.handleTimerUpdates.bind(this), intervalTime); 
    }

    handleTimerUpdates() {
        this.updateIndex(); 
        console.log('Handling..' + this.glider);
        let intervalTime = 1000; 
        this.timerId = setTimeout(this.handleTimerUpdates.bind(this), intervalTime); 
    }

    updateIndex() {
        switch (this.curPattern) {
            case PATTERN.FORWARD: 
            {
                // Get the right light payload. 
                // Create a payload with the index. 
                // Emit the payload to the world. 
                this.glider++; 
                if (this.glider === NUM_LIGHTS) {
                    this.chooseNewPattern(); 
                }
                break;
            }

            case PATTERN.BACKWARD: {
                this.glider--; 
                if (this.glider < 0) {
                    this.chooseNewPattern(); 
                }
                break; 
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
}

module.exports = Sequencer;