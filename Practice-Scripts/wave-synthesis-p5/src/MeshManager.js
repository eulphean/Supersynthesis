// Handles all the code related to interaction with the canvas. 
class MeshManager {
    constructor() {
        // Pass
    }

    draw(isUserInteracting, lights) {
        if (isUserInteracting) {
            for (let i = 0; i < lights.length; i++) {
                let vertex = [mouseX, mouseY];
                let light = lights[i];
                if (light.topVal) {
                    let pos = light.topPos;
                    this.drawLine(pos, vertex);
                }

                if (light.bottomVal) {
                    let pos = light.bottomPos;
                    this.drawLine(pos, vertex);
                }
            }
            this.drawEllipse();
        }        
    }

    drawEllipse() {
        fill(COL_WHITE);
        strokeWeight(3);
        stroke(COL_BLACK);
        ellipse(mouseX, mouseY, 30);  
    }

    drawLine(startPoint, endPoint) {
        stroke(COL_WHITE);
        strokeWeight(2);
        line(startPoint['x'], startPoint['y'], endPoint[0], endPoint[1]);
    }
}