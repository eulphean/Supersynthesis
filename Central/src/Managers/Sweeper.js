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

class Sweeper {
    constructor(payloadPackager) {
        this.payloadPackager = payloadPackager;
        this.glider = 0;
        this.timerId = ''; 
        this.curDirection = DIRECTION.RIGHT; 
    }

    begin() {
        if (!this.isRunning()) {
            this.glider = 0;
            this.handleInterval();
        }

        // Else, receive events and interpret them.
        // Sweeper is already active.
    }

    handleInterval() {
        if (this.glider === NUM_LIGHTS) {
            // Reached all the way to one side. 
            this.curDirection = DIRECTION.LEFT; 
            // Turn off everything. 
            this.payloadPackager.clearLightsPayloadAndEmit();
        } else if (this.glider === -1) {
            // Reached all the way to the other side. 
            this.curDirection = DIRECTION.RIGHT;
            // Turn off everything.
            this.payloadPackager.clearLightsPayloadAndEmit();
        } else {
            // Emit things. 
            this.payloadPackager.createSweeperPayloadAndEmit(this.glider);
        }

        // Direction.
        if (this.curDirection === DIRECTION.RIGHT) {
            this.glider += 1; 
        } else if (this.curDirection === DIRECTION.LEFT) {
            this.glider -= 1; 
        }  

        this.timerId = setTimeout(this.handleInterval.bind(this), 500);
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
}

module.exports = Sweeper;