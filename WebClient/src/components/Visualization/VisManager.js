/*
  Name: VistManager.js
  Author: Amay Kataria
  Date: 03/25/2024
  Description: This is a special manager, exclusively to visualize the data in Supersynthesis. This initializes the
  lights and the data points with the required value and then draws them. 
*/

import FullDbConfigStore from '../../stores/FullDbConfigStore';
import VisLight from './VisLight'
import DataPoint from './DataPoint';

const NUM_LIGHTS = 24

export default class VisManager {
    constructor(s) {
        this.p5 = s; 
        this.visLights = [];
        this.dataPoints = new Array(NUM_LIGHTS).fill(0).map(a => []);

        // Prepare all the lights. 
        this.prepareLights();

        // Retrieve fullDB data and prepare all the data.
        FullDbConfigStore.getLightConfigs(() => this.prepareDataPoints());
    }

    // It should be called when light configs are actually ready. 
    prepareDataPoints() {
        let data = FullDbConfigStore.allLightConfigs;

        // Distance between each tube. 
        const lightIncrement = (this.p5.width) / NUM_LIGHTS;
        const lightWidth = lightIncrement / 2; 
        if (data) {
            let numEntries = data.length/20; 
            for (let i = 0; i < numEntries; i++) {
                let lights = data[i]['config']['lights'];
                for (let j = 0; j < NUM_LIGHTS; j++) {
                    let v = lights[j];
                    
                    // Calculate the light position based on different variables.
                    const xPos = j * lightIncrement + lightWidth; 
                    const yPos = this.p5.map(i, 0, numEntries, 10, this.p5.height);
                    
                    // Create a new data point.
                    let dp = new DataPoint(this.p5, xPos, yPos, v);
                    this.dataPoints[j].push(dp);
                }
            }
            
            console.log(this.dataPoints);
        }
    }

    prepareLights() {
        this.visLights = []; 

        // Distance between each tube. 
        const lightIncrement = (this.p5.width) / NUM_LIGHTS;

        // Width of each light is half the distance between each light.
        const lightWidth = lightIncrement / 2;
        for (let i = 0; i < NUM_LIGHTS; i++) {
            let xPos = i * lightIncrement; 
            // Create a new light instance. 
            let l = new VisLight(this.p5, i, xPos, this.p5.height, lightWidth);
            this.visLights.push(l);
        }
    }
    
    draw() {
        // Draw the lights based on the state. 
        for (let i = 0; i < this.visLights.length; i++) {
            let light = this.visLights[i]; 
            light.draw();

            // Draw all the points on that column.
            for (let j = 0; j < this.dataPoints[i].length; j++) {
                this.dataPoints[i][j].draw();
            }
        }
    }
}