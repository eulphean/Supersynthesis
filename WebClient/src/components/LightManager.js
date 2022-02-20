/*
  Name: LightManager.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: A class responsible for handling all the lights. This class is the most critical class
  in this project. 
*/
import Light from './Light'
import { LIGHT_TYPE, LIGHT_STATE, GROW_STATE } from "../stores/LightConfigStore";

const NUM_LIGHTS = 24
// TODO: Convert this to BPM. 
// TODO: This should come from the user interaction. 
const TIME_ON = 100; // 100 ms

export default class LightManager {
    constructor(s) {
        this.p5 = s; 
        this.lights = [];
        this.curTime = Date.now();
        this.gliderIdx = 0;
        this.allLightsOff = false; 
        this.direction = true; // True - Right, False - Left
    }
    
    setup() {
        // Prepare the light collection.
        this.prepareLights();
    }

    prepareLights() {
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

    // Fired when new light updates are received. 
    // updateLights() {
    //     console.log('New lights received: Update the light heights.');
    //     for (let i = 0; i < NUM_LIGHTS; i++) {
    //         let l = this.lights[i]; 
    //         // let configState = LightConfigStore.getState(i);
    //         // l.setHeight(configState);
    //     }
    // }
    
    draw(isUserInteracting, meshEllipsePos, boundaryWidth) {
        // Is user interacting? Draw all the lights. 
        if (isUserInteracting) {
            // Control the lights. 
            this.handleUserInteracting(meshEllipsePos, boundaryWidth);
        } else {
            // Cycle the lights from left to right, then right to left. 
            this.handleUserNotInteracting(); 
        } 

        // Draw the lights based on the state. 
        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].draw(isUserInteracting);
        }
    }

    handleUserInteracting(meshEllipsePos, boundaryWidth) {       
        // Update the light configuration based on the ellipse. 
        this.updateLightConfig(meshEllipsePos, boundaryWidth);

        for (let i = 0; i < this.lights.length; i++) {
            let light = this.lights[i];

            let lightType = LIGHT_TYPE.TOP; 
            if (light.isOn(lightType)) {
                light.updateDrawState(lightType, true);
            }
            // We want to be showing the ones that are currently off in the 
            // interaction part because they are actually shrinking, so we
            // don't disable the draw state on this. 
            lightType = LIGHT_TYPE.BOTTOM; 
            if (light.isOn(lightType)) {
                light.updateDrawState(lightType, true);
            }
            // We want to be showing the ones that are currently off in the 
            // interaction part because they are actually shrinking, so we
            // don't disable the draw state on this. 
        }

        // All lights are not off. 
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

    handleUserNotInteracting() {
        // TODO: Wait for the grow animation to finish for the lights,
        // then start the beating the lights based on the bpm. Don't really
        // need to do this. 
        // Are lights on?
        if (!this.allLightsOff) {
            this.turnOffAllLights(); 
            console.log('Switch all lights off.');
            // Reset glider
            this.gliderIdx = 0; 
            this.curTime = Date.now();
        }

        let elapsedTime  = Date.now() - this.curTime;
        if (elapsedTime > TIME_ON) {
            // Get the current light. 
            let light = this.lights[this.gliderIdx];

            // Are we going right? 
            if (this.direction) {
                if (light.isOn(LIGHT_TYPE.TOP)) {
                    light.updateDrawState(LIGHT_TYPE.TOP, true);
                    this.curTime = Date.now();
                }
                this.gliderIdx += 1;
            } else {
                // We are definitely going left. 
                if (light.isOn(LIGHT_TYPE.BOTTOM)) {
                    light.updateDrawState(LIGHT_TYPE.BOTTOM, true);
                    this.curTime = Date.now();
                }
                this.gliderIdx -= 1;
            }

            // We have reached the right most point, start the bottom row. 
            if (this.gliderIdx === NUM_LIGHTS) {
                this.gliderIdx = NUM_LIGHTS - 1;
                this.direction = false; 
            }

            if (this.gliderIdx < 0) {
                // Turn off all the lights and start again. 
                this.resetSystem();
            }
        }
    }

    turnOffAllLights() {
        // Top and Bottom lights.
        for (let i = 0; i < this.lights.length; i++) {
            let light = this.lights[i];
            light.updateDrawState(LIGHT_TYPE.TOP, false);
            light.updateDrawState(LIGHT_TYPE.BOTTOM, false);
        }

        // // Keeps track of the lights. 
        this.allLightsOff = true; 
    }

    resetSystem() {
        this.turnOffAllLights();
        this.gliderIdx = 0; 
        this.direction = true;
    }
}