
let tubes = []

const Num_Points = 800

let drawLine = false;
let vertices = [];
let clearNextTime = true;

let lightManager, meshManager; 
let idx = 0;

let isUserInteracting = false; 

function setup() {
    createCanvas(1000, 400);
    smooth();
    lightManager = new LightManager();
    meshManager = new MeshManager();
    lightManager.setup();
}
  
// RENDER LOOP
function draw() {
    background(color(0, 0, 0));  
    
    // Draw lights.
    lightManager.draw(isUserInteracting, meshManager.ellipsePos);
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

function keyPressed() {
    if (keyCode == 32) {
        lightManager.createNewLightConfig(); 
    }
}