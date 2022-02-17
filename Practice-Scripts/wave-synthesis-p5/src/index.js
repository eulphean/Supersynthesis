
let tubes = []

const Num_Points = 800

let drawLine = false;
let vertices = [];
let clearNextTime = true;

let lightManager = new LightManager(); 
let meshManager = new MeshManager();
let idx = 0;

let isUserInteracting = false; 

function setup() {
    createCanvas(1000, 400);
    smooth();
    lightManager.setup();
}
  
// RENDER LOOP
function draw() {
    background(color(0, 0, 0));  
    
    // Draw lights.
    lightManager.draw(isUserInteracting);
    drawCenterLine();
    meshManager.draw(isUserInteracting, lightManager.lights); 
}

function drawCenterLine() {
    // Draw a center line. 
    stroke("black")
    strokeWeight(6)
    line(0, height/2, width, height/2)
}

function mousePressed() {
    isUserInteracting = true; 
}

function mouseDragged() {
}

function mouseReleased() {
    isUserInteracting = false; 
}

// function drawDebugLine() {
//     if (drawLine) {
//         for (let i = 1; i < vertices.length; i++) {
//             let curV = vertices[i];
//             let prevV = vertices[i-1];
//             stroke('rgba(0,255,0, 0.25)')
//             strokeWeight(5);
//             line(curV['x'], curV['y'], prevV['x'], prevV['y']); 
//         }
//     }
// }

// function mouseDragged() {
//     if (clearNextTime == true) {
//         vertices = [];
//         clearNextTime = false;
//     }

//     let pos = {'x': mouseX,'y': mouseY};

//     if (vertices.length > Num_Points) {
//         vertices.shift();
//         vertices.push(pos);
//     } else {
//         vertices.push(pos);
//     }

//     idx++;

//     if (idx == 50) {
//         calculateSlots();
//         idx = 0;
//     }

//     drawLine = false;
// }   

// function mouseReleased() {
//     clearNextTime = true;
//     drawLine = true; 
// }
