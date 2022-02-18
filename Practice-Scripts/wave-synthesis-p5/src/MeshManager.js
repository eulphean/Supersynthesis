// Handles all the code related to interaction with the canvas.
const EASING = 0.05;  
class MeshManager {
    constructor() {
        this.ellipsePos = createVector(0, 0);
    }

    draw(isUserInteracting, lights) {
        if (isUserInteracting) {    
            // Calculate new ellipse position. 
            this.ellipsePos['x'] += (mouseX - this.ellipsePos['x']) * EASING;
            this.ellipsePos['y'] += (mouseY - this.ellipsePos['y']) * EASING; 

            // Draw pull lines for top and bottom lights.
            for (let i = 0; i < lights.length; i++) {
                let light = lights[i];
                if (light.configState[LIGHT_TYPE.TOP] === LIGHT_STATE.ON) {
                    let pos = light.topPos;
                    this.drawLine(pos, this.ellipsePos);
                }

                if (light.configState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON) {
                    let pos = light.bottomPos;
                    this.drawLine(pos, this.ellipsePos);
                }
            }

            // Draw ellipse tracking the mouse. 
            this.drawEllipse();
        }        
    }

    drawEllipse() {
        fill(color(255, 255, 255, 200));
        strokeWeight(3);
        stroke(color('black'));
        ellipse(this.ellipsePos['x'], this.ellipsePos['y'], 30);  
    }

    drawLine(startPoint, endPoint) {
        stroke(color(255, 255, 255, 200));
        strokeWeight(2);
        line(startPoint['x'], startPoint['y'], endPoint['x'], endPoint['y']);
    }
}