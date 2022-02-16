const NUM_SLOTS = 24
let slots = []
const Distance_From_Edge = 20
const Distance_Between = 10
const Slot_Height = 200
const Num_Points = 800

let drawLine = false;
let vertices = [];
let clearNextTime = true;

let idx = 0;

function setup() {
    createCanvas(1000, 400);
    smooth();
    calculateSlots();
}
  
// RENDER LOOP
function draw() {
    background(color(0, 0, 0));  
    
    // Draw top and bottom slots. 
    for (let i = 0; i < slots.length; i++) {
        slots[i].draw();
    }
    drawCenterLine();

    drawPullingLines();
}

function drawCenterLine() {
    // Draw a center line. 
    stroke("black")
    strokeWeight(5)
    line(0, height/2, width, height/2)
}

function drawDebugLine() {
    if (drawLine) {
        for (let i = 1; i < vertices.length; i++) {
            let curV = vertices[i];
            let prevV = vertices[i-1];
            stroke('rgba(0,255,0, 0.25)')
            strokeWeight(5);
            line(curV['x'], curV['y'], prevV['x'], prevV['y']); 
        }
    }
}

function drawPullingLines() {
    if (!drawLine) {
        if (vertices.length > 0) {
            // Join the vertices to the top of the slots. 
            for (let i = 0; i < slots.length; i++) {
                // Current mouse verex. 
                let vertex = vertices[vertices.length-1];
                let slot = slots[i];
                if (slot.topVal) {
                    let pos = slot.topPos; 
                    stroke('rgba(255, 255, 255, 0.5)');
                    strokeWeight(3);
                    line(pos['x'], pos['y'], vertex['x'], vertex['y']);
                }
                
                if(slot.bottomVal) {
                    let pos = slot.bottomPos;
                    stroke('rgba(255, 255, 255, 0.5)');
                    strokeWeight(3);
                    line(pos['x'], pos['y'], vertex['x'], vertex['y']);
                }
            }

            // Draw the ellipse. 
            fill('rgba(255, 255, 255, 0.25)');
            strokeWeight(3);
            stroke('rgba(255, 255, 255, 0.25)');
            ellipse(mouseX, mouseY, 50);    
        } 
    }
}

function mouseDragged() {
    if (clearNextTime == true) {
        vertices = [];
        clearNextTime = false;
    }

    let pos = {'x': mouseX,'y': mouseY};

    if (vertices.length > Num_Points) {
        vertices.shift();
        vertices.push(pos);
    } else {
        vertices.push(pos);
    }

    idx++;

    if (idx == 50) {
        calculateSlots();
        idx = 0;
    }

    drawLine = false;
}   

function mouseReleased() {
    clearNextTime = true;
    drawLine = true; 
}

function calculateSlots() {
    slots = [];
    // Prepare the slots. 
    // Distance between each slot. 
    let slotInterval = (width-(2*Distance_From_Edge)) / NUM_SLOTS;
    // Width of each slot.
    let slotWidth = slotInterval / 2;
    let i = Distance_From_Edge;
    while (i <= (width-Distance_From_Edge)) {
        let xPos = i;
        let s = new Slot(xPos, height/2, slotWidth);
        slots.push(s)
        i += slotInterval
    }

    waitingForCalc = false;
}