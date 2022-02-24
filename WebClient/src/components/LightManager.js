/*
  Name: LightManager.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: A class responsible for handling all the lights. This class is the most critical class
  in this project. 
*/
import Light from './Light'
import LightConfigStore, { LIGHT_TYPE  } from "../stores/LightConfigStore";
import Websocket from './Websocket';

const NUM_LIGHTS = 24

export default class LightManager {
    constructor(s) {
        this.p5 = s; 
        this.lights = [];
        this.curTime = Date.now();
        this.gliderIdx = 0;
        this.direction = true; // True - Right, False - Left
        this.allLightsOff = false; 
        this.isCurrentlyGrowing = false; 
        this.timeOn = 0; 
    }
    
    setup() {
        // Prepare the light collection.
        this.prepareLights();
        LightConfigStore.subscribeInfo(this.updateTimeOn.bind(this));
        // LightConfigStore.subscribeLights(this.updateLights.bind(this));
    }

    // New bpm received. 
    updateTimeOn() {
        let newBpm = LightConfigStore.getBpm();
        this.timeOn = (60 * 1000)/newBpm;
    }

    updateLightTimerData(payloadState) {
        console.log(payloadState);
    }

    updateLights() {
        this.resetSystem();
    }

    prepareLights() {
        this.lights = []; 

        // Set max height again since the canvas has been resized. 
        LightConfigStore.setMaxHeight(this.p5.height/2);
        
        // Distance between each tube. 
        let lightIncrement = (this.p5.width) / NUM_LIGHTS;

        // Width of each light is half the distance between each light.
        let lightWidth = lightIncrement / 2;
        for (let i = 0; i < NUM_LIGHTS; i++) {
            let xPos = i * lightIncrement; 
            // Create a new light instance. 
            let l = new Light(this.p5, i, xPos, this.p5.height/2, lightWidth);
            this.lights.push(l);
        }
    }
    
    draw(isUserInteracting, meshEllipsePos, boundaryWidth) {
        // Is user interacting? Draw all the lights. 
        if (isUserInteracting) {
            // Control the lights. 
            this.handleUserInteracting(meshEllipsePos, boundaryWidth);
        } else {
            // Reset this value here. 
            // this.isCurrentlyGrowing = false;  
            // Cycle the lights from left to right, then right to left. 
            // this.handleUserNotInteracting(); 
        }

        // Draw the lights based on the state. 
        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].draw(isUserInteracting, this.isCurrentlyGrowing);
        }
    }

    handleUserInteracting(meshEllipsePos, boundaryWidth) {       
        // Update the light configuration based on the ellipse. 
        this.updateLightConfig(meshEllipsePos, boundaryWidth);

        this.allLightsOff = false;
    }

    updateLightConfig(meshEllipsePos, boundaryWidth) {
        for (let i = 0; i < this.lights.length; i++) {
            let light = this.lights[i];

            // Distance from the ellipse to the light's position. 
            let d = meshEllipsePos.dist(light.pos);

            // Is the ellipse above the half-way line? 
            if (meshEllipsePos['y'] < this.p5.height/2) {
                // Handle the top lights. 
                // Have we crossed the threshold? 
                if (d < boundaryWidth/2) {
                    // This light is activated, grow or shrink. 
                    light.updateGrowState(LIGHT_TYPE.TOP);
                }
            } else { // Is the ellipse below the half-way line? 
                // Handle the bottom lights. 
                if (d < boundaryWidth/2) {
                    // This light is activated, grow or shrink. 
                    light.updateGrowState(LIGHT_TYPE.BOTTOM);
                }
            }
        }
    }

    resetSystem() {
        this.turnOffAllLights();
        this.gliderIdx = 0; 
        this.direction = true;
    }
}


// turnOffAllLights() {
//     console.log('Switch off all lights');
//     // Top and Bottom lights.
//     for (let i = 0; i < this.lights.length; i++) {
//         let light = this.lights[i];
//         light.updateDrawState(LIGHT_TYPE.TOP, false);
//         light.updateDrawState(LIGHT_TYPE.BOTTOM, false);
//     }

//     this.allLightsOff = true; 
// }


// testDataLights(data) {
//     let idx = data['idx'];
//     let val = data['val'];
//     let type = data['type'];
//     if (val === 1) {
//         let light = this.lights[idx];
//         let lightType;
//         if (type === 1) {
//             lightType = LIGHT_TYPE.TOP;
//         } else {
//             lightType = LIGHT_TYPE.BOTTOM;
//         }
//         light.updateDrawState(lightType, true);
//     }

//     if (val === -1) {
//         this.lights.forEach(l => {
//             l.updateDrawState(LIGHT_TYPE.TOP, false);
//             l.updateDrawState(LIGHT_TYPE)
//         })
//     }
// }

// handleUserNotInteracting() {
//     // Are all lights completely grown out? 
//     // Are the Grow states on all lights set to none?
//     for (let i = 0; i < this.lights.length; i++) {
//         let light = this.lights[i];
//         let top = light.isGrowing(LIGHT_TYPE.TOP);
//         let bottom = light.isGrowing(LIGHT_TYPE.BOTTOM);
//         this.isCurrentlyGrowing = this.isCurrentlyGrowing || top || bottom; 
//     }

//     // A clean reset to the system. 
//     if (!this.isCurrentlyGrowing & !this.allLightsOff) {
//         this.resetSystem();
//     }

//     if (!this.isCurrentlyGrowing) {
//         let elapsedTime  = Date.now() - this.curTime;
//         if (elapsedTime > this.timeOn) {
//             // Get the current light. 
//             let light = this.lights[this.gliderIdx];

//             // Are we going right? 
//             if (this.direction) {
//                 if (light.isOn(LIGHT_TYPE.TOP)) {
//                     light.updateDrawState(LIGHT_TYPE.TOP, true);
//                     this.curTime = Date.now();
//                 }
//                 this.gliderIdx += 1;
//             } else {
//                 // We are definitely going left. 
//                 if (light.isOn(LIGHT_TYPE.BOTTOM)) {
//                     light.updateDrawState(LIGHT_TYPE.BOTTOM, true);
//                     this.curTime = Date.now();
//                 }
//                 this.gliderIdx -= 1;
//             }

//             // We have reached the right most point, start the bottom row. 
//             if (this.gliderIdx === NUM_LIGHTS) {
//                 this.gliderIdx = NUM_LIGHTS - 1;
//                 this.direction = false; 
//             }

//             if (this.gliderIdx < 0) {
//                 // Turn off all the lights and start again. 
//                 this.resetSystem();
//             }
//         }
//     }
// }
