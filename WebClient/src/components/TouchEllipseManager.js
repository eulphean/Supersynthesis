/*
  Name: TouchEllipseManager.js
  Author: Amay Kataria
  Date: 05/02/2022
  Description: Class responsible to highlight all touches in the synth mode. Synth mode is important
  and is one of the new additions to the app.
*/

// Handles all the code related to interaction with the canvas.
import TouchStore from "../stores/TouchStore";
import ModeStore, {MODE} from "../stores/ModeStore";

const ELLIPSE_RADIUS = 35; 

export default class TouchEllipseManager {
    constructor(s) {
        this.p5 = s; 
    }

    draw() {
        if (ModeStore.getCurrentMode() === MODE.SYNTH) {
            const touches = TouchStore.getTouches();
            touches.forEach(t => {
                this.drawEllipse(t.x, t.y);
            });
        }
    }

    drawEllipse(posX, posY) {
        // Inner ellipse
        this.p5.fill(this.p5.color(255, 255, 255, 150));
        this.p5.strokeWeight(3);
        this.p5.stroke(this.p5.color('black'));
        this.p5.ellipse(posX, posY, ELLIPSE_RADIUS);  
    }
}