/*
  Name: Light.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: A class representing each light that is painted on the canvas. 
*/
import { LIGHT_TYPE, LIGHT_STATE } from "../stores/LightConfigStore";
export const GROW_STATE = {
    NONE: 0,
    GROW: 1,
    SHRINK: 2
}

const GROW_FACTOR = 2.5;

export default class Light {
    constructor(s, xPos, yPos, lightWidth) {
        // Sketch object. 
        this.p5 = s; 

        // Light's width. 
        this.lightWidth = lightWidth;

        // Origin point at the center.
        this.pos = this.p5.createVector(xPos, yPos);
        
        let newX = this.getNewPos() + this.lightWidth/2; // Keep this at the center of the light.
        // Point at the top. 
        this.topPos = this.p5.createVector(newX, yPos - this.p5.height/2);
        // Point at the bottom.
        this.bottomPos = this.p5.createVector(newX, yPos + this.p5.height/2);        

        // Is this getting draw or not? 
        this.drawState = {
            'TOP': -1,
            'BOTTOM': -1
        }
        this.growState = {
            'TOP': GROW_STATE.NONE,
            'BOTTOM': GROW_STATE.NONE
        }
        this.lightHeight = {
            'TOP': 0,
            'BOTTOM': 0
        };

        // Colors. 
        this.lightColor = this.p5.color('white');
        this.lightPointColor = this.p5.color('green'); // Only debug.
    }

    draw() {
        let newX = this.getNewPos();
        this.p5.fill(this.lightColor);
        this.p5.noStroke();

        this.handleGrowState(LIGHT_TYPE.TOP);
        this.handleGrowState(LIGHT_TYPE.BOTTOM);

        // Am I supposed to draw this top light? 
        if (this.drawState[LIGHT_TYPE.TOP] === LIGHT_STATE.ON) {
            this.p5.rect(newX, this.pos['y'], this.lightWidth, -this.lightHeight['TOP']);
        }

        // Am I supposed to draw this bottom light?
        if (this.drawState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON) {
            this.p5.rect(newX, this.pos['y'], this.lightWidth, this.lightHeight['BOTTOM']);    
        }
    }

    // Grow & Shrink the height of the light.
    handleGrowState(lightType) {
        switch (this.growState[lightType]) {
            case GROW_STATE.NONE: {
                // Pass don't do antyhing. 
                break;
            }

            case GROW_STATE.GROW: {
                if (this.lightHeight[lightType] < this.p5.height/2) {
                    this.lightHeight[lightType] += GROW_FACTOR;
                    this.mapPos(lightType);
                }
                break;
            }

            case GROW_STATE.SHRINK: {
                if (this.lightHeight[lightType] > 0) {
                    this.lightHeight[lightType] -= GROW_FACTOR; 
                    this.mapPos(lightType);
                }
                break;
            }

            default: 
                break;
        }
    }

    mapPos(lightType) {
        if (lightType === LIGHT_TYPE.TOP) {
            this.topPos['y'] = this.p5.map(this.lightHeight[LIGHT_TYPE.TOP], 0, this.p5.height/2, this.p5.height/2, 0);
        } else {
            this.bottomPos['y'] = this.p5.map(this.lightHeight[LIGHT_TYPE.BOTTOM], 0, this.p5.height/2, this.p5.height/2, this.p5.height);
        }
    }

    drawLightPoint(pos) {
        let newX = this.getNewPos();
        this.p5.fill(this.lightPointColor)
        this.p5.circle(newX, this.pos['y'], 10);
    }
    
    getNewPos() {
        return this.pos['x'] + this.lightWidth/2; 
    }

    // Only the draw state is stored here. 
    setDrawState(lightType, lightState) {
        this.drawState[lightType] = lightState;
    }

    updateGrowState(isTop, state) {
        if (isTop) {
            this.topVal = state; 
        } else {
            this.bottomVal = state; 
        }
    }

    // Set the height of the light based on its original configuration.
    setHeight(configState) {
        if (configState[LIGHT_TYPE.TOP] === LIGHT_STATE.ON) {
            this.lightHeight[LIGHT_TYPE.TOP] = this.p5.height/2;
        }

        if (configState[LIGHT_TYPE.TOP] === LIGHT_STATE.OFF) {
            this.lightHeight[LIGHT_TYPE.TOP] = 0;
        }

        if (configState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON) {
            this.lightHeight[LIGHT_TYPE.BOTTOM] = this.p5.height/2;
        }

        if (configState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.OFF) {
            this.lightHeight[LIGHT_TYPE.BOTTOM] = 0;
        }
    }
}