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
        this.allLightsOn = false; 
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
    
    draw(isUserInteracting) {
        // Is user interacting? Draw all the lights. 
        if (isUserInteracting) {
            // Turn on all the lights. 
            // Draw controls.
            this.handleUserInteracting();
        } else {
            // Cycle the lights from left to right, then right to left. 
            this.handleUserNotInteracting(); 
        } 

        // Draw the lights based on the state. 
        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].draw();
        }
    }

    handleUserInteracting() {
        if (!this.allLightsOn) {
            console.log('Switch all lights on.');
            this.switchAllLights(true);
        }
    }

    handleUserNotInteracting() {
        // Are all the lights on? Turn them off. 
        if (this.allLightsOn) {
            this.switchAllLights(false); 
            console.log('Switch all lights off.');
            // Reset glider
            this.gliderIdx = 0; 
            this.curTime = Date.now();
        }

        let elapsedTime  = Date.now() - this.curTime;
        if (elapsedTime > TIME_ON) {
            // Are we going right? 
            if (this.direction) {
                // Turn on the top lights one by one.
                this.lights[this.gliderIdx].setOnState(true, true);             
                this.gliderIdx += 1;
            } else {
                this.lights[this.gliderIdx].setOnState(false, true);   
                this.gliderIdx -= 1;
            }

            // We have reached the right most point, start the bottom row. 
            if (this.gliderIdx == NUM_LIGHTS) {
                this.gliderIdx = NUM_LIGHTS - 1;
                this.direction = false; 
            }

            if (this.gliderIdx < 0) {
                this.switchAllLights(false); 
                this.gliderIdx = 0;
                this.direction = true;
            }
            this.curTime = Date.now();
        }
    }

    switchAllLights(state) {
        // Top and Bottom lights.
        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].setOnState(true, state); 
            this.lights[i].setOnState(false, state);
        }

        // Set the current state of all the lights. 
        // True - all lights on. 
        // False - all lights off. 
        this.allLightsOn = state; 
    }
}