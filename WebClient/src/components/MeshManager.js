/*
  Name: MeshManager.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: A class responsible for drawing the connections from the ellipse to all
  the moving lights on the canvas. 
*/
import EditModeStore from "../stores/EditModeStore";

// Handles all the code related to interaction with the canvas.
const EASING = 0.025;  
const ELLIPSE_RADIUS = 50; 
export default class MeshManager {
    constructor(s) {
        this.p5 = s; 
        this.ellipsePos = this.p5.createVector(this.p5.width/3, this.p5.height/2);
        this.boundaryWidth = this.p5.height/1.5;
        this.prevMouseX = 0;
        this.prevMouseY = 0; 
    }

    draw(lights) {
        let isEditMode = EditModeStore.isEditMode; 
        let isPopupActive = EditModeStore.isPopupActive;        
        if (isEditMode) {
            let mouseX, mouseY;
            // Don't trap mouseX or mouseY if I'm in the popup. 
            if (isPopupActive || this.p5.mouseY > this.p5.height || this.p5.mouseY < 0) {
                mouseX = this.prevMouseX;
                mouseY = this.prevMouseY; 
            } else {
                mouseX = this.p5.mouseX;
                mouseY = this.p5.mouseY;
            }

            this.ellipsePos['x'] += (mouseX - this.ellipsePos['x']) * EASING;
            this.ellipsePos['y'] += (mouseY - this.ellipsePos['y']) * EASING; 

            // Make sure the ellipse doesn't go outside the boundary.
            this.containEllipse();

            // Draw pull lines for top and bottom lights.
            for (let i = 0; i < lights.length; i++) {
                let light = lights[i];

                let pos = light.topPos;
                let height = light.getHeight();
                if (height < this.p5.height && height > 0) {
                    this.drawLine(pos, this.ellipsePos, i);
                }
            }

            // Draw ellipse tracking the mouse. 
            this.drawEllipse();

            this.prevMouseX = mouseX;
            this.prevMouseY = mouseY;
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
        // // Outer ellipse boundary 
        // this.p5.fill(this.p5.color(255, 255, 255, 50));
        // this.p5.noStroke();
        // this.p5.ellipse(this.ellipsePos['x'], this.ellipsePos['y'], this.boundaryWidth);  

        // Inner ellipse
        this.p5.fill(this.p5.color(255, 255, 255, 150));
        this.p5.strokeWeight(3);
        this.p5.stroke(this.p5.color('black'));
        this.p5.ellipse(this.ellipsePos['x'], this.ellipsePos['y'], ELLIPSE_RADIUS);  
    }

    drawLine(startPoint, endPoint, i) {
        let opacity = this.p5.map(i, 0, 24, 100, 200);
        let weight = this.p5.map(i, 0, 25, 2, 4);
        this.p5.stroke(this.p5.color(255, 255, 255, opacity));
        this.p5.strokeWeight(weight);
        this.p5.line(startPoint['x'], startPoint['y'], endPoint['x'], endPoint['y']);
    }
}

// // Use the local state to draw the lines. 
// if (this.ellipsePos['y'] < this.p5.height/2) {
//     let pos = light.topPos;
//     let height = light.getHeight(LIGHT_TYPE.TOP);
//     if (height < this.p5.height/2 && height > 0) {
//         this.drawLine(pos, this.ellipsePos, i);
//     }
// } else {
//     let pos = light.bottomPos;
//     let height = light.getHeight(LIGHT_TYPE.BOTTOM);
//     if (height < this.p5.height/2 && height > 0) {
//         this.drawLine(pos, this.ellipsePos, i);
//     }
// }