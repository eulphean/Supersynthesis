/*
  Name: bpmManager.js
  Author: Amay Kataria
  Date: 02/20/2022
  Description: A class responsible for handling the logic to calculate the bpm for the current configuration.
*/

import LightConfigStore, { LIGHT_TYPE } from "../stores/LightConfigStore";
import EditModeStore from "../stores/EditModeStore";

const MAX_BPM = 250;
const MIN_BPM = 100;
export default class bpmManager {
    constructor(s) {
        this.p5 = s;
        this.curBpm = LightConfigStore.bpm;
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
                if (light.isOn(LIGHT_TYPE.TOP)) {
                    sum += 1; 
                }
                if (light.isOn(LIGHT_TYPE.BOTTOM)) {
                    sum += 1; 
                }
            }

            // Time that has elapsed. 
            let elapsedTime = Date.now() - this.curTime; 
            let v = this.p5.sin(elapsedTime /(sum)); 
            let mapped =  this.p5.map(v, -1, 1, 0, 0.25);
            
            // Calculate the new bpm. 
            this.curBpm = shouldAdd ? (this.curBpm + mapped) : (this.curBpm - mapped); 
            
            if (this.curBpm < MIN_BPM) {
                this.curBpm = MIN_BPM; 
            } 

            if (this.curBpm > MAX_BPM) {
                this.curBpm = MAX_BPM;
            }

            // Send updates to component subscribed for the event. 
            LightConfigStore.setLocalBpm(Math.floor(this.curBpm));
        } else {
            // Keep snapshotting the time, so we can calculate
            // the elapsed time. 
            this.curTime = Date.now(); 
        }
    }
}