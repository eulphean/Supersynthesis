// Handles all the code related to initializing the tubes and 
// drawing them. 

const NUM_LIGHTS = 24
// Convert this to BPM and should come from
// previous values. 
const TIME_ON = 100; // 100 ms

class LightManager {
    constructor() {
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
        let lightIncrement = (width) / NUM_LIGHTS;
        // Width of each light is half the distance between each light.
        let lightWidth = lightIncrement / 2;
        for (let i = 0; i < NUM_LIGHTS; i++) {
            let xPos = i * lightIncrement; 
            let l = new Light(xPos, height/2, lightWidth);
            this.lights.push(l);
        }

        console.log(this.lights);
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
            if (light.localState[LIGHT_TYPE.TOP] === LIGHT_STATE.ON) {
                light.setDrawState(LIGHT_TYPE.TOP, LIGHT_STATE.ON);
            }
            // We want to be showing the ones that are currently off in the 
            // interaction part because they are actually shrinking, so we
            // don't disable the draw state on this. 

            if (light.localState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON) {
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
            if (meshEllipsePos['y'] < height/2) {
                // Have we crossed a certain threshold? 
                if (d > height / 2) {
                    // Just update the local state. Based on the current local state,
                    // draw states will be updated automatically.
                    light.localState[LIGHT_TYPE.TOP] = LIGHT_STATE.ON;
                    light.growState[LIGHT_TYPE.TOP] = GROW_STATE.GROW; 
                } else {
                    light.localState[LIGHT_TYPE.TOP] = LIGHT_STATE.OFF;
                    light.growState[LIGHT_TYPE.TOP] = GROW_STATE.SHRINK;
                }
            } else {
                // Handle the bottom lights. 
                if (d > height / 2) {
                    // Just update the local state. Based on the current local state,
                    // draw states will be updated automatically.
                    light.localState[LIGHT_TYPE.BOTTOM] = LIGHT_STATE.ON;
                    light.growState[LIGHT_TYPE.BOTTOM] = GROW_STATE.GROW; 
                } else {
                    light.localState[LIGHT_TYPE.BOTTOM] = LIGHT_STATE.OFF;
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

            // Are we going right? 
            if (this.direction) {
                if (light.localState[LIGHT_TYPE.TOP] === LIGHT_STATE.ON) {
                    light.setDrawState(LIGHT_TYPE.TOP, LIGHT_STATE.ON);
                    this.curTime = Date.now();
                }
                this.gliderIdx += 1;
            } else {
                if (light.localState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON) {
                    light.setDrawState(LIGHT_TYPE.BOTTOM, LIGHT_STATE.ON);
                    this.curTime = Date.now();
                }
                this.gliderIdx -= 1;
            }

            // We have reached the right most point, start the bottom row. 
            if (this.gliderIdx == NUM_LIGHTS) {
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

    // NOTE: This config will come from the database. 
    // On user interaction, this config will be edited. 
    createNewLightConfig() {
        console.log('Fresh config received');
        this.resetSystem();
        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].setOriginalState(); 
        }
    }

    resetSystem() {
        this.turnOffAllLights();
        this.gliderIdx = 0; 
        this.direction = true;
    }
}