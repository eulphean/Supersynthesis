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


// function drawPullingLines() {
//     if (!drawLine) {
//         if (vertices.length > 0) {
//             // Join the vertices to the top of the slots. 
//             for (let i = 0; i < slots.length; i++) {
//                 // Current mouse verex. 
//                 let vertex = vertices[vertices.length-1];
//                 let slot = slots[i];
//                 if (slot.topVal) {
//                     let pos = slot.topPos; 
//                     stroke('rgba(255, 255, 255, 0.5)');
//                     strokeWeight(3);
//                     line(pos['x'], pos['y'], vertex['x'], vertex['y']);
//                 }
                
//                 if(slot.bottomVal) {
//                     let pos = slot.bottomPos;
//                     stroke('rgba(255, 255, 255, 0.5)');
//                     strokeWeight(3);
//                     line(pos['x'], pos['y'], vertex['x'], vertex['y']);
//                 }
//             }

//             // Draw the ellipse. 
//             fill('rgba(255, 255, 255, 0.25)');
//             strokeWeight(3);
//             stroke('rgba(255, 255, 255, 0.25)');
//             ellipse(mouseX, mouseY, 50);    
//         } 
//     }
// }