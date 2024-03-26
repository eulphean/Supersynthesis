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
      this.rot = 0;
    }

    draw(pointSize, pointShape, rotate, rotateSpeed, showInactive, showActive, colorInactive, colorActive) {
      if (this.val === 1 && showActive || this.val === 0 && showInactive) {
          // Choose color
          if (this.val === 1) {
            this.p5.fill(colorInactive);
          } else {
            this.p5.fill(colorActive);
          }

          this.p5.push();
          this.p5.translate(this.xPos, this.yPos);
          this.p5.rotate(this.rot);

          if (rotate) {
            this.rot += rotateSpeed;
          }

          // Circle
          if (pointShape === 'circle') 
            this.p5.circle(0, 0, pointSize);
            
          // Rectangle
          if (pointShape === 'rectangle') {
            this.p5.push();
            this.p5.rectMode(this.p5.CENTER);
            this.p5.rect(0, 0, pointSize, pointSize);
            this.p5.pop();
          }

          // Triangle
          if (pointShape === 'triangle') {
            const x = 0;
            const y = 0;
            this.p5.triangle(x-pointSize, y-pointSize, x+pointSize, y-pointSize, x, y+pointSize);  
          }

          if (pointShape === 'arc') {
            this.p5.arc(0, 0, pointSize*2, pointSize*2, 0, this.p5.PI);
          }

          this.p5.pop();
        }
    }
}