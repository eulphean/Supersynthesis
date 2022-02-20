/*
  Name: MeshManager.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: A class responsible for drawing the connections from the ellipse to all
  the moving lights on the canvas. 
*/

import LightConfigStore, { LIGHT_TYPE, LIGHT_STATE } from "../stores/LightConfigStore";

// Handles all the code related to interaction with the canvas.
const EASING = 0.015;  
export default class MeshManager {
    constructor(s) {
        this.p5 = s; 
        this.ellipsePos = this.p5.createVector(0, 0);
        this.boundaryWidth = this.p5.height/2;
    }

    draw(isUserInteracting, lights) {
        if (isUserInteracting) {    
            this.ellipsePos['x'] += (this.p5.mouseX - this.ellipsePos['x']) * EASING;
            this.ellipsePos['y'] += (this.p5.mouseY - this.ellipsePos['y']) * EASING; 

            // Make sure the ellipse doesn't go outside the boundary.
            this.containEllipse();

            // Draw pull lines for top and bottom lights.
            for (let i = 0; i < lights.length; i++) {
                let light = lights[i];

                // // Use the config state values to check which lines to draw.
                // let lightConfigState = LightConfigStore.getState(i);

                // // Use the local state to draw the lines. 
                // if (lightConfigState[LIGHT_TYPE.TOP] === LIGHT_STATE.ON) {
                //     let pos = light.topPos;
                //     if (light.lightHeight[LIGHT_TYPE.TOP] < this.p5.height/2 && 
                //             light.lightHeight[LIGHT_TYPE.TOP] > 0) {
                //         this.drawLine(pos, this.ellipsePos, i);
                //     }
                // }

                // // Use the local state to draw the lines.
                // if (lightConfigState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON) {
                //     let pos = light.bottomPos;
                //     if (light.lightHeight[LIGHT_TYPE.BOTTOM] < this.p5.height/2 && 
                //         light.lightHeight[LIGHT_TYPE.BOTTOM] > 0) {
                //         this.drawLine(pos, this.ellipsePos, i);
                //     }
                // }
            }

            // Draw ellipse tracking the mouse. 
            this.drawEllipse();
        }        
    }
    
    // Calculate new ellipse position. 
    containEllipse() {
        if (this.ellipsePos['x'] > this.p5.width) {
        this.ellipsePos['x'] = this.p5.width;
        } 

        if (this.ellipsePos['x'] < 0) {
            this.ellipsePos['x'] = 0;
        } 

        if (this.ellipsePos['y'] > this.p5.height) {
            this.ellipsePos['y'] = this.p5.height;
        } 

        if (this.ellipsePos['y'] < 0) {
            this.ellipsePos['y'] = 0;
        } 
    }

    drawEllipse() {
        // Outer ellipse boundary 
        this.p5.fill(this.p5.color(255, 255, 255, 50));
        this.p5.noStroke();
        this.p5.ellipse(this.ellipsePos['x'], this.ellipsePos['y'], this.boundaryWidth);  

        // Inner ellipse
        this.p5.fill(this.p5.color(255, 255, 255, 200));
        this.p5.strokeWeight(3);
        this.p5.stroke(this.p5.color('black'));
        this.p5.ellipse(this.ellipsePos['x'], this.ellipsePos['y'], 30);  
    }

    drawLine(startPoint, endPoint, i) {
        this.p5.stroke(this.p5.color(255, 255, 255, (i+1)*5));
        this.p5.strokeWeight(2);
        this.p5.line(startPoint['x'], startPoint['y'], endPoint['x'], endPoint['y']);
    }
}