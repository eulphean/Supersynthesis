// Handles all the code related to interaction with the canvas.
const EASING = 0.015;  
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

                // Use the local state to draw the lines. 
                if (light.drawState[LIGHT_TYPE.TOP] === LIGHT_STATE.ON) {
                    let pos = light.topPos;
                    if (light.movingHeight[LIGHT_TYPE.TOP] < height/2 && 
                            light.movingHeight[LIGHT_TYPE.TOP] > 0) {
                        this.drawLine(pos, this.ellipsePos, i);
                    }
                }

                // Use the local state to draw the lines.
                if (light.drawState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON) {
                    let pos = light.bottomPos;
                    if (light.movingHeight[LIGHT_TYPE.BOTTOM] < height/2 && 
                        light.movingHeight[LIGHT_TYPE.BOTTOM] > 0) {
                        this.drawLine(pos, this.ellipsePos, i);
                    }
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

    drawLine(startPoint, endPoint, i) {
        stroke(color(255, 255, 255, (i+1)*5));
        strokeWeight(2);
        line(startPoint['x'], startPoint['y'], endPoint['x'], endPoint['y']);
    }
}