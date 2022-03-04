// Author: Amay Kataria
// Date: 02/15/2022
// File: lightManager.js
// Description: Helper module to format the light data properly that is sent across multiple clients. 

const EVENT_SEQUENCER_PAYLOAD = 'event_sequencer_payload';

const DIRECTION = {
    RIGHT: 1,
    LEFT: 0
}
const OFF_TIME = 500; // 250 milliseconds. 

class LightManager {
    constructor(io) {
        this.io = io;
        this.timerId = ''; 
    }

    resetLights(payload) {
        // Time interval between each light state. 
        this.intervalTime = 0; 
        // Current index of the light. 
        this.curIdx = -1;
        this.direction = DIRECTION.RIGHT; 
        this.lights = [];
        let lightData = payload['lights'];
        lightData.forEach(d => {
            this.lights.push(d); 
        });
        // Current light state sent to the clients. 
        this.lightState = []; 
    }

    setupTimer(payload) {
        // this.clearTimer(); 
        // this.resetLights(payload);
        // this.intervalTime = this.getIntervalTime(payload['bpm']);
        // this.handleInterval(); 
    }

    updateTimer(payload) {
        console.log('Update timer without touching the current index.');
        this.clearTimer(); 
        // Update interval time. 
        this.intervalTime = this.getIntervalTime(payload['bpm']); 
        // Reassign the stored lights. 
        this.lights = []; 
        let lightData = payload['lights'];
        lightData.forEach(d => {
            this.lights.push(d); 
        });
        // Clear the current state. 
        this.lightState = []; 
        setTimeout(this.handleInterval.bind(this), OFF_TIME);
    }

    handleInterval() {
        let lightPayload = this.getLightPayload();
        // We added a type to the payload for 
        this.io.of('/app').emit(EVENT_SEQUENCER_PAYLOAD, lightPayload); 
        // If state is none, we need to turn off the lights. Thus, we use OFF_TIME. 
        let timeToWait = lightPayload['state'] === 'NONE' ? OFF_TIME : this.intervalTime; 
        this.updateCurIdx();
        // Recursive call to handle interval until the timerId is cleared. 
        this.timerId = setTimeout(this.handleInterval.bind(this), timeToWait); 
    }

    getLightPayload() {
        // TURN OFF ALL THE LIGHTS. 
        if (this.curIdx === -1 || this.curIdx === 24) {        
            return {state: 'NONE', direction: 'NONE'};
        }

        // Send top light state one by one. 
        if (this.direction === DIRECTION.RIGHT) {
            let d = {'idx': this.curIdx, 'val': this.lights[this.curIdx]};
            this.lightState.push(d);
            return { state: this.lightState, direction: 'RIGHT' };
        } 

        // Send bottom light state one by one. 
        if (this.direction === DIRECTION.LEFT) {
            let d = {'idx': this.curIdx, 'val': this.lights[this.curIdx]};
            this.lightState.push(d);
            return { state: this.lightState, direction: 'LEFT' };
        }
    }

    updateCurIdx() {
        if (this.direction === DIRECTION.RIGHT) {
            if (this.curIdx === 24) {
                this.curIdx = 23;
                this.direction = DIRECTION.LEFT; 
                // Reset light state. 
                this.lightState = []; 
            } else {
                this.curIdx = this.curIdx + 1;
            }
        } else {
            if (this.curIdx === -1) {
                this.curIdx = 0;
                this.direction = DIRECTION.RIGHT; 
                // Reset light state. 
                this.lightState = [];
            } else {
                this.curIdx = this.curIdx - 1; 
            }
        }
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

    doesTimerExist() {
        // return this.timerId !== '';
        return true; 
    }
}

module.exports = LightManager;