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

            // Draw pull lines for top and bottom ones.
            for (let i = 0; i < lights.length; i++) {
                let light = lights[i];
                if (light.topVal) {
                    let pos = light.topPos;
                    this.drawLine(pos, this.ellipsePos);
                }

                if (light.bottomVal) {
                    let pos = light.bottomPos;
                    this.drawLine(pos, this.ellipsePos);
                }
            }

            // Draw ellipse in the center
            this.drawEllipse();
        }        
    }

    drawEllipse() {
        fill(COL_WHITE);
        strokeWeight(3);
        stroke(COL_BLACK);
        ellipse(this.ellipsePos['x'], this.ellipsePos['y'], 30);  
    }

    drawLine(startPoint, endPoint) {
        stroke(COL_WHITE);
        strokeWeight(2);
        line(startPoint['x'], startPoint['y'], endPoint['x'], endPoint['y']);
    }
}