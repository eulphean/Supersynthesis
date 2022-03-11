/*
  Name: bpmManager.js
  Author: Amay Kataria
  Date: 02/20/2022
  Description: A class responsible for handling the logic to calculate the bpm for the current configuration.
*/

import BpmStore from '../stores/BpmStore'
import EditModeStore from "../stores/EditModeStore";

const MAX_BPM = 300;
const MIN_BPM = 150;
export default class bpmManager {
    constructor(s) {
        this.p5 = s;
        BpmStore.subscribe(() => {
            this.curBpm = BpmStore.getLocalBpm();
        }); 
        this.curTime = ''; 
    }

    // Simple BPM calculator.
    update(ellipsePos, lights) {
        let isEditMode = EditModeStore.isEditMode; 
        let isUserInteracting = EditModeStore.isUserInteracting;
        // The user must be in Edit Mode and be interacting for the
        // local bpm to be changing. 
        if (isUserInteracting && isEditMode) { 
            let shouldAdd = false; 
            if (((ellipsePos['x'] > this.p5.width/2) && (ellipsePos['y'] < this.p5.height/2))
                || ((ellipsePos['x'] < this.p5.width/2) && (ellipsePos['y'] > this.p5.height/2))){
                shouldAdd = true; 
            } else {
                shouldAdd = false; 
            }
            
            // Number of lights that are on. 
            let sum = 0; 
            for (let i = 0; i < lights.length; i++) {
                let light = lights[i];
                if (light.isOn()) {
                    sum += 1; 
                }
            }

            // Time that has elapsed. 
            let elapsedTime = Date.now() - this.curTime; 
            let v = this.p5.sin((elapsedTime + 0.1) / (sum + 1)); 
            let mapped =  this.p5.map(v, -1, 1, 0, 0.1);
            
            // Calculate the new bpm. 
            if (shouldAdd) {
                this.curBpm = this.curBpm + mapped * 3.0;
            }

            if (!shouldAdd) {
                this.curBpm = this.curBpm - mapped * 0.01;
            }
            
            if (this.curBpm < MIN_BPM) {
                this.curBpm = MIN_BPM; 
            } 

            if (this.curBpm > MAX_BPM) {
                this.curBpm = MAX_BPM;
            }

            // Send updates to component subscribed for the event. 
            BpmStore.setLocalBpm(Math.floor(this.curBpm));
        } else {
            // Keep snapshotting the time, so we can calculate
            // the elapsed time. 
            this.curTime = Date.now(); 
        }
    }
}