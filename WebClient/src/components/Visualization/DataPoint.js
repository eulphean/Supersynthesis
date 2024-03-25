/*
  Name: DataPoint.js
  Author: Amay Kataria
  Date: 03/25/2024
  Description: This is a special class to render a data point. 
*/

export default class DataPoint {
    constructor(index, xPos, value) {
      this.index = index;
      this.xPos = xPos;
      this.val = value;
    }
}