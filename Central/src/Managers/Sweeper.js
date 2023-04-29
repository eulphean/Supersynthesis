// Author: Amay Kataria
// Date: 04/25/2023
// File: SweepManager.js
// Description: A custom score generator for the installation. I'm calling it the Sweeper currently because that's what it's name as in the 
// app - (Sweep)
const EVENT_SEQUENCER_PAYLOAD = 'event_sequencer_payload';

const NUM_LIGHTS = 24;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1
}
const PATTERN_CHANGE_TIME = 250;

const MIN_SWEEPER_TIME = 150; 
const MAX_SWEEPER_TIME = 500;

const MAX_PATTERNS = 7; 
const PATTERN = {
    FORWARD: 0,
    FULL_FLASH: 1, 
    HALF_FLASH: 2,
    RANDOM: 3,
    SPLIT: 4,
    MERGE: 5,
    BACKWARD: 6
}

const MAX_RANDOM_NOTES = 24;
const MAX_FLASHES = 5;

class Sweeper {
    constructor(payloadPackager) {
        this.payloadPackager = payloadPackager;
        this.glider = 0;
        this.gliderA = 0;
        this.gliderB = 0;
        this.timerId = ''; 
        this.curPattern = PATTERN.FORWARD;
        this.prevPattern = PATTERN.FORWARD;

        // Flasher
        this.numFlashes = 0; 
        this.maxFlashes = MAX_FLASHES;
        this.flashSide = 0;

        this.randomNoteIdx = 0; 
        this.randomList = []; 

        this.sweeperTime = 100;
    }

    begin() {
        if (!this.isRunning()) {
            this.glider = 0;
            this.handleInterval();
        }
    }

    handleInterval() {
        const patternChanged = this.updateSweeper();
        let intervalTime = 0;
        intervalTime = patternChanged ? PATTERN_CHANGE_TIME : this.sweeperTime; 
        this.timerId = setTimeout(this.handleInterval.bind(this), intervalTime);
    }

    updateSweeper() {
        let patternChanged = false; 
        switch(this.curPattern) {
            case PATTERN.FORWARD: {
                if (this.glider === NUM_LIGHTS) {
                    this.payloadPackager.clearLightsPayloadAndEmit();
                    this.chooseNewPattern();
                    patternChanged = true;
                } else {
                    this.payloadPackager.createSweeperPayloadAndEmit(this.glider);
                    this.glider += 1; 
                    patternChanged = false; 
                }               
                break;
            }

            case PATTERN.BACKWARD: {
                if (this.glider === -1) {
                    this.payloadPackager.clearLightsPayloadAndEmit();
                    this.chooseNewPattern();
                    patternChanged = true; 
                } else {
                    this.payloadPackager.createSweeperPayloadAndEmit(this.glider); 
                    this.glider -= 1; 
                    patternChanged = false;
                }
                break;
            }

            case PATTERN.RANDOM: {
                if (this.randomNoteIdx === MAX_RANDOM_NOTES) {
                    this.payloadPackager.clearLightsPayloadAndEmit();
                    this.chooseNewPattern();
                    patternChanged = true; 
                } else {
                    // Get a random index. 
                    this.calcRandomIndex(); 
                    this.payloadPackager.createSweeperPayloadAndEmit(this.gliderA);
                    this.randomNoteIdx++; 
                    patternChanged = false; 
                }
                break;
            }

            case PATTERN.MERGE: {
                // GliderA is going right, GliderB is going left. 
                if (this.gliderA > this.gliderB) {
                    this.payloadPackager.clearLightsPayloadAndEmit();
                    this.chooseNewPattern();
                    patternChanged = true; 
                } else {
                    this.payloadPackager.createSweeperPayloadAndEmit(this.gliderA, this.gliderB);
                    this.gliderA++;
                    this.gliderB--; 
                    patternChanged = false; 
                }
                break;
            }

            case PATTERN.SPLIT: {
                // GliderA is going left, GliderB is going right.
                if (this.gliderA < 0 && this.gliderB === NUM_LIGHTS) {
                    this.payloadPackager.clearLightsPayloadAndEmit(); 
                    this.chooseNewPattern();
                    patternChanged = true; 
                } else {
                    // Send two gliders together.
                    this.payloadPackager.createSweeperPayloadAndEmit(this.gliderA, this.gliderB); 
                    this.gliderA--;
                    this.gliderB++; 
                    patternChanged = false; 
                }
                break;
            }

            case PATTERN.FULL_FLASH: {
                if (this.numFlashes <= this.maxFlashes) {
                    if (this.numFlashes % 2 == 0) {
                        this.payloadPackager.createSweeperFlashPayload(true); 
                    } else {
                        this.payloadPackager.clearLightsPayloadAndEmit();
                    }
                    this.numFlashes += 1;
                } else {
                    this.payloadPackager.clearLightsPayloadAndEmit();
                    this.chooseNewPattern();
                }
                break;
            }
 
            case PATTERN.HALF_FLASH: {
                if (this.numFlashes <= this.maxFlashes) {
                    if (this.numFlashes % 2 == 0) {
                        this.payloadPackager.createSweeperFlashPayload(false, this.flashSide); 
                    } else {
                        this.payloadPackager.clearLightsPayloadAndEmit();
                        this.flashSide += 1; 
                    }
                    this.numFlashes += 1;
                } else {
                    this.payloadPackager.clearLightsPayloadAndEmit();
                    this.chooseNewPattern();
                }
            }

            default: {
                break;
            }
        }

        // Final value of the pattern changed.
        return patternChanged; 
    }

    setRandomPattern() {
        this.curPattern = this.getRandom(MAX_PATTERNS); 
        while (this.curPattern === this.prevPattern) {
            this.curPattern = this.getRandom(MAX_PATTERNS)
        }
        this.prevPattern = this.curPattern; 
    }

    chooseNewPattern() {
        // Reset all values.
        this.glider = 0; 
        this.gliderA = -1; 
        this.gliderB = -1; 

        this.randomNoteIdx = 0; 
        this.randomList = []; 

        // Set a random pattern.
        this.setRandomPattern();

        // Set new time.
        this.sweeperTime = this.getRandomInt(MIN_SWEEPER_TIME, MAX_SWEEPER_TIME);

        // Select a new pattern
        switch (this.curPattern) {
            case PATTERN.FORWARD: {
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

            case PATTERN.MERGE: {
                this.gliderA = 0; 
                this.gliderB = NUM_LIGHTS - 1; 
                break;
            }

            case PATTERN.SPLIT: {
                // Reset gliderA and gliderB.
                let middle = NUM_LIGHTS / 2;
                this.gliderA = middle; 
                this.gliderB = middle -1; 
                break;
            }

            case PATTERN.FULL_FLASH: {                
                this.numFlashes = 0;
                this.maxFlashes = this.getRandomInt(1, MAX_FLASHES);
                break;
            }

            case PATTERN.HALF_FLASH: {                
                this.numFlashes = 0;
                this.flashSide = 0;
                this.maxFlashes = this.getRandomInt(1, MAX_FLASHES);
                break;
            }

            default: {
                break;
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
        console.log('Stop Sweeper.');
        this.payloadPackager.clearLightsPayloadAndEmit();
        this.clearTimer(); 
    }

    isRunning() {
        return this.timerId !== '';
    }

    clearTimer() {
        if (this.timerId !== '') {
            console.log('Sweeper: Cleaning previous timer: ' + this.timerId);
            clearTimeout(this.timerId); 
            this.timerId = '';
        }
    }

    getRandom(max) {
        return Math.floor(Math.random() * max);
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
}

module.exports = Sweeper;