/*
  Name: LightManager.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: A class responsible for handling all the lights. This class is the most critical class
  in this project. 
*/
import Light from './Light'
import LightConfigStore, { LIGHT_TYPE  } from "../stores/LightConfigStore";
import EditModeStore from '../stores/EditModeStore';

const NUM_LIGHTS = 24

export default class LightManager {
    constructor(s) {
        this.p5 = s; 
        this.lights = [];
    }
    
    setup() {
        // Prepare the light collection.
        this.prepareLights();
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
    
    draw(meshEllipsePos, boundaryWidth) {
        // Only
        let isUserInteracting = EditModeStore.isUserInteracting; 
        let isEditMode = EditModeStore.isEditMode; 
        if (isUserInteracting) {
            // Update the light configuration based on the user's finger. 
            this.updateLightGrowConfig(meshEllipsePos, boundaryWidth);
        }

        // Draw the lights based on the state. 
        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].draw();
        }

        if (isUserInteracting || isEditMode) {
            // Draw a center line. 
            this.p5.stroke("black")
            this.p5.strokeWeight(6)
            this.p5.line(0, this.p5.height/2, this.p5.width, this.p5.height/2)
        }
    }

    updateLightGrowConfig(meshEllipsePos, boundaryWidth) {
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
}

// // Reset this value here. 
// this.isCurrentlyGrowing = false;  
// // Cycle the lights from left to right, then right to left. 
// // this.handleUserNotInteracting(); 
// for (let i = 0; i < this.lights.length; i++) {
//     let light = this.lights[i];
//     let top = light.isGrowing(LIGHT_TYPE.TOP);
//     let bottom = light.isGrowing(LIGHT_TYPE.BOTTOM);
//     this.isCurrentlyGrowing = this.isCurrentlyGrowing || top || bottom; 
// }