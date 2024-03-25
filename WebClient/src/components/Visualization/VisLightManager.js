/*
  Name: VisLightManager.js
  Author: Amay Kataria
  Date: 03/25/2024
  Description: This is a special light manager, exclusively to visualize the data in Supersynthesis.  
*/

import VisLight from './VisLight'

const NUM_LIGHTS = 24

export default class VisLightManager {
    constructor(s) {
        this.p5 = s; 
        this.visLights = [];
    }
    
    setup() {
        // Prepare the light collection.
        this.prepareLights();
    }

    prepareLights() {
        this.visLights = []; 

        // Distance between each tube. 
        let lightIncrement = (this.p5.width) / NUM_LIGHTS;

        // Width of each light is half the distance between each light.
        let lightWidth = lightIncrement / 2;
        for (let i = 0; i < NUM_LIGHTS; i++) {
            let xPos = i * lightIncrement; 
            // Create a new light instance. 
            let l = new VisLight(this.p5, i, xPos, this.p5.height, lightWidth);
            this.visLights.push(l);
        }
    }
    
    draw() {
        // Draw the lights based on the state. 
        for (let i = 0; i < this.visLights.length; i++) {
            let light = this.visLights[i]; 
            light.draw();
        }
    }
}