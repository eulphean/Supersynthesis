/*
  Name: VisLight.js
  Author: Amay Kataria
  Date: 03/25/2024
  Description: A special class to represent a Light on data-visualization page. 
*/

export default class VisLight {
    constructor(s, i, xPos, yPos, lightWidth) {
        // Sketch object. 
        this.p5 = s; 

        // Light's width. 
        this.lightWidth = lightWidth;


        // Origin point at the bottom of the canvas. 
        this.pos = this.p5.createVector(xPos, yPos);
        
        // Point at the top. 
        let newX = this.getNewPos() + this.lightWidth/2; // Keep this at the center of the light.
        this.topPos = this.p5.createVector(newX, 0); // By default at the top. (Always changing)
        this.top = this.p5.createVector(newX, 0); 
        
        // Colors. 
        this.lightActiveColor = this.p5.color('white');
        this.lightInactiveColor = this.p5.color(255, 255, 255, 125);
        this.lightBgColor = this.p5.color(255, 255, 255, 30);
        this.lightPointColor = this.p5.color('green'); // Only debug.

        // Store the current light config. 
        this.curIdx = i; 
    }

    draw() {
        let newX = this.getNewPos();
        this.p5.noStroke();  
        this.p5.fill(this.lightInactiveColor);
        this.p5.rect(newX, this.pos['y'], this.lightWidth, -this.p5.height);  
    }

    drawLightPoint() {
        let newX = this.getNewPos();
        this.p5.fill(this.lightPointColor)
        this.p5.circle(newX, this.pos['y'], 5);
    }
    
    getNewPos() {
        return this.pos['x'] + this.lightWidth/2; 
    }
}