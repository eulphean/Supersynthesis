const Num_Bulbs = 8;
let bulbsA = [];
let points = [];
let SLOW_FACTOR = 0.01;
const MAX_AMP = 500; 

function setup() {
    createCanvas(window.innerWidth, window.innerWidth);
    background(color(0, 0, 0));  
    
    // Draw the bulbs
    let increment = height/Num_Bulbs; 
    for (let i = 0; i < Num_Bulbs; i++)
    {
        let y = 10 + i * increment;   
        let b = new Bulb(width/2, y, (i+1));
        bulbsA.push(b);
    }

    // Draw the line
    for (let i = 0; i < Num_Bulbs; i++)
    {
        let y = 10 + i * increment;
        let p = new Point(width/2, y, i);
        points.push(p);
    }
}
  
// RENDER LOOP
function draw() {
    background(color(0, 0, 0));  
    
    // for (let p of points) {
    //     p.draw();
    // }

    for (let b of bulbsA){
        b.draw(points);
    }

        // Draw a line in the center. 
        strokeWeight(5);
        stroke('red');
        line(window.innerWidth/2, 0, window.innerWidth/2, height);
    
}