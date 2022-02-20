/*
  Name: LightManager.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: A class responsible for handling all the lights. This class is the most critical class
  in this project. 
*/
import Light, {GROW_STATE} from './Light'
import LightConfigStore, { LIGHT_TYPE, LIGHT_STATE } from "../stores/LightConfigStore";

const NUM_LIGHTS = 24
// TODO: Convert this to BPM. 
// TODO: This should come from the user interaction. 
const TIME_ON = 100; // 100 ms

// TODO: IT SHOULD SUBSCRIBE TO THE LIGHTCONFIGSTORE
export default class LightManager {
    constructor(s) {
        this.p5 = s; 
        this.lights = [];
        this.curTime = Date.now();
        this.gliderIdx = 0;
        this.allLightsOff = false; 
        this.direction = true; // True - Right, False - Left

        // Callback to trigger when new light updates are received.
        LightConfigStore.subscribeLights(this.updateLights.bind(this));
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
            let l = new Light(this.p5, xPos, this.p5.height/2, lightWidth);
            // Set the height of each tube based on the light config. 
            let configState = LightConfigStore.getState(i); 
            l.setHeight(configState);
            this.lights.push(l);
        }
    }

    // Fired when new light updates are received. 
    updateLights() {
        console.log('New lights received: Update the light heights.');
        for (let i = 0; i < NUM_LIGHTS; i++) {
            let l = this.lights[i]; 
            let configState = LightConfigStore.getState(i);
            l.setHeight(configState);
        }
    }
    
    draw(isUserInteracting, meshEllipsePos) {
        // Is user interacting? Draw all the lights. 
        if (isUserInteracting) {
            // Control the lights. 
            this.handleUserInteracting(meshEllipsePos);
        } else {
            // Cycle the lights from left to right, then right to left. 
            this.handleUserNotInteracting(); 
        } 

        // Draw the lights based on the state. 
        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].draw();
        }
    }

    handleUserInteracting(meshEllipsePos) {       
        // CORE CORE CORE ALGORITHM>!
        this.updateLightConfig(meshEllipsePos);


        for (let i = 0; i < this.lights.length; i++) {
            let light = this.lights[i];
            // Use the state from the store because this is the source of truth of 
            // the incoming light data. 
            let lightConfigState = LightConfigStore.getState(this.gliderIdx);

            if (lightConfigState[LIGHT_TYPE.TOP] === LIGHT_STATE.ON) {
                light.setDrawState(LIGHT_TYPE.TOP, LIGHT_STATE.ON);
            }
            // We want to be showing the ones that are currently off in the 
            // interaction part because they are actually shrinking, so we
            // don't disable the draw state on this. 
            if (lightConfigState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON) {
                light.setDrawState(LIGHT_TYPE.BOTTOM, LIGHT_STATE.ON);
            }
            // We want to be showing the ones that are currently off in the 
            // interaction part because they are actually shrinking, so we
            // don't disable the draw state on this. 
        }

        // All lights are not off. 
        this.allLightsOff = false; 
    }

    // TODO: Use a combination of the ellipse' position on the screen,
    // current light config, and the velocity with which the ellipse
    // is moved on the screen to create a new config.
    updateLightConfig(meshEllipsePos) {
        for (let i = 0; i < this.lights.length; i++) {
            let light = this.lights[i];
            
            let d = meshEllipsePos.dist(light.pos);
            if (meshEllipsePos['y'] < this.p5.height/2) {
                // Have we crossed a certain threshold? 
                if (d > this.p5.height / 2) {
                    // Update the config states. 
                    LightConfigStore.setState(i, LIGHT_TYPE.TOP, LIGHT_STATE.ON);
                    light.growState[LIGHT_TYPE.TOP] = GROW_STATE.GROW; 
                } else {
                    // Update the config states. 
                    LightConfigStore.setState(i, LIGHT_TYPE.TOP, LIGHT_STATE.OFF);
                    light.growState[LIGHT_TYPE.TOP] = GROW_STATE.SHRINK;
                }
            } else {
                // Handle the bottom lights. 
                if (d > this.p5.height / 2) {
                    // Just update the local state. Based on the current local state,
                    // draw states will be updated automatically.
                    LightConfigStore.setState(i, LIGHT_TYPE.BOTTOM, LIGHT_STATE.ON);
                    light.growState[LIGHT_TYPE.BOTTOM] = GROW_STATE.GROW; 
                } else {
                    LightConfigStore.setState(i, LIGHT_TYPE.BOTTOM, LIGHT_STATE.OFF);
                    light.growState[LIGHT_TYPE.BOTTOM] = GROW_STATE.SHRINK;
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
            let lightConfigState = LightConfigStore.getState(this.gliderIdx);

            // Are we going right? 
            if (this.direction) {
                if (lightConfigState[LIGHT_TYPE.TOP] === LIGHT_STATE.ON) {
                    light.setDrawState(LIGHT_TYPE.TOP, LIGHT_STATE.ON);
                    this.curTime = Date.now();
                }
                this.gliderIdx += 1;
            } else {
                // We are definitely going left. 
                if (lightConfigState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON) {
                    light.setDrawState(LIGHT_TYPE.BOTTOM, LIGHT_STATE.ON);
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
            light.setDrawState(LIGHT_TYPE.TOP, LIGHT_TYPE.OFF);
            light.setDrawState(LIGHT_TYPE.BOTTOM, LIGHT_TYPE.OFF);
        }

        // Keeps track of the lights. 
        this.allLightsOff = true; 
    }

    resetSystem() {
        this.turnOffAllLights();
        this.gliderIdx = 0; 
        this.direction = true;
    }
}