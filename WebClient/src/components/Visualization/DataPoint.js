/*
  Name: DataPoint.js
  Author: Amay Kataria
  Date: 03/25/2024
  Description: This is a special class to render a data point. 
*/

export default class DataPoint {
    constructor(s, xPos, yPos, value) {
      // Sketch variable
      this.p5 = s;
      this.xPos = xPos; 
      this.yPos = yPos; 
      this.val = value;
    }

    draw(pointSize) {
      //this.p5.fill(this.p5.color("green"));
      if (this.val === 1) {
        this.p5.fill("black");
        // Change the color based on the value. 
        this.p5.circle(this.xPos, this.yPos, pointSize);
      } else {
        this.p5.fill("white");
        this.p5.circle(this.xPos, this.yPos, pointSize);
      }
    }
}