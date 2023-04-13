/*
  Name: LightManager.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: A class responsible for handling all the lights. This class is the most critical class
  in this project. 
*/
import Light from './Light'
import LightConfigStore from "../stores/LightConfigStore";
import SequencerBubble from './SequencerBubble';

const NUM_LIGHTS = 24

export default class LightManager {
    constructor(s) {
        this.p5 = s; 
        this.lights = [];
        this.showResetAnimation = false; 
        this.curTime = 0; 
        this.var = 0; 
        this.dir = true; 

        this.sequencerBubble = new SequencerBubble(s);
    }
    
    setup() {
        // Prepare the light collection.
        this.prepareLights();
    }

    prepareLights() {
        this.lights = []; 

        // Set max height again since the canvas has been resized. 
        LightConfigStore.setMaxHeight(this.p5.height);
        
        // Distance between each tube. 
        let lightIncrement = (this.p5.width) / NUM_LIGHTS;

        // Width of each light is half the distance between each light.
        let lightWidth = lightIncrement / 2;
        for (let i = 0; i < NUM_LIGHTS; i++) {
            let xPos = i * lightIncrement; 
            // Create a new light instance. 
            let l = new Light(this.p5, i, xPos, this.p5.height, lightWidth);
            this.lights.push(l);
        }
    }
    
    draw(meshEllipsePos, boundaryWidth) {
        console.log('Draw Lights');
        // Draw the lights based on the state. 
        for (let i = 0; i < this.lights.length; i++) {
            let light = this.lights[i]; 
            light.draw(meshEllipsePos, boundaryWidth);
            //this.sequencerBubble.draw(light);
        }
    }
}