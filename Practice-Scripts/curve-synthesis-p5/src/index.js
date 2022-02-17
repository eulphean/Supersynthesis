let lights = [];
const NUM_LIGHTS = 24; 
let isUserInteracting = false; 

let easing = 0.05;
let dragPos; 

function setup() {
    createCanvas(800, 800);
    smooth();

    // create lights
    let numInterval = width/NUM_LIGHTS;
    for (let i = 0; i < NUM_LIGHTS; i++) {
        let xPos = i*numInterval + numInterval/2; 
        let light = new Light(xPos, height/2, height/2);
        lights.push(light); 
    }

    dragPos = createVector(0, 0);
}
  
// RENDER LOOP
function draw() {
    background(color(0, 0, 0));  
    drawCenterLine();
    drawLightPoints();

    if (isUserInteracting) {
        // Ease it.
        dragPos['x'] += (mouseX - dragPos['x']) * easing; 
        dragPos['y'] += (mouseY - dragPos['y']) * easing; 

        drawPullLines();   

        // Update lights if pull lines are strong
        for (let i = 0; i < lights.length; i++) {
            let light = lights[i];
            let curMousePos = createVector(dragPos['x'], dragPos['y']);
            let d = curMousePos.dist(light.pos);
            if (mouseY < height/2) {
                if (d > 0.5*height) {
                    light.grow(true);
                } else {
                    light.grow(false);
                }
            }
        }
    }
}

function drawLightPoints() {
    for (let i = 0; i < lights.length; i++) {
        lights[i].draw();
    }
}

function drawCenterLine() {
    stroke(255);
    strokeWeight(5);
    line(0, height/2, width, height/2);
}

function drawPullLines() {
    // Draw the ellipse tracker.
    fill('rgba(255,255,255, 0.5'); 
    ellipse(dragPos['x'], dragPos['y'], 30);

    // Draw a line from the ellipse to each point. 
    for (let i = 0; i < lights.length; i++) {
        let light = lights[i];
        stroke(255, 255, 255, 100);
        strokeWeight(2); 
        if (light.topPos['y'] === 0 || light.topPos['y'] === height/2) {
            console.log(light.topPos['y']);
            
        } else {
            line(light.topPos['x'], light.topPos['y'], dragPos['x'], dragPos['y']);
        }
    }
}

function mousePressed() {
    isUserInteracting = true;
}

function mouseDragged() {

}

function mouseReleased() {
    isUserInteracting = false; 
}

function keyPressed() {

}


// let isDrawingA = false;
// let isDrawingB = false; 

// let verticesA = []; let colA = 'red';
// let verticesB = []; let colB = 'green';

// let point = {'x': mouseX, 'y': mouseY};

// if (isDrawingA) {
//     verticesA.push(point);
// }

// if (isDrawingB) {
//     verticesB.push(point);
// }


// noFill();
// strokeWeight(2);

// stroke(colA);
// beginShape()
//     for (let i = 0; i < verticesA.length; i++) {
//         let p = verticesA[i];
//         //fill('white');
//         // ellipse(p['x'], p['y'], 5);
//         curveVertex(p['x'], p['y']);
//     }
// endShape()

// stroke(colB);
// beginShape();
// for (let i = 0; i < verticesB.length; i++) {
//     let p = verticesB[i];
//     //fill('white');
//     // ellipse(p['x'], p['y'], 5);
//     curveVertex(p['x'], p['y']);
// }
// endShape();


// if (keyCode == 49) {
//     isDrawingA = true;
//     isDrawingB = false
// }

// if (keyCode == 50) {
//     isDrawingA = false;
//     isDrawingB = true; 
// }

// // Clear all
// if (keyCode == 32) {
//     verticesA = []; 
//     verticesB = [];
// }

// if (keyCode == 13) {
//     console.log('Add the two curves together');
// }