/*
  Name: Light.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: A class representing each light that is painted on the canvas. 
*/
import LightConfigStore, { LIGHT_TYPE, LIGHT_STATE, GROW_STATE } from "../stores/LightConfigStore";

const GROW_FACTOR = 2.5;

export default class Light {
    constructor(s, i, xPos, yPos, lightWidth) {
        // Sketch object. 
        this.p5 = s; 

        // Light's width. 
        this.lightWidth = lightWidth;

        // Origin point at the center.
        this.pos = this.p5.createVector(xPos, yPos);
        
        // Point at the top. 
        let newX = this.getNewPos() + this.lightWidth/2; // Keep this at the center of the light.
        this.topPos = this.p5.createVector(newX, yPos - this.p5.height/2);
        // Point at the bottom.
        this.bottomPos = this.p5.createVector(newX, yPos + this.p5.height/2);        
        
        // Colors. 
        this.lightColor = this.p5.color('white');
        this.lightPointColor = this.p5.color('green'); // Only debug.

        // Store the current light config. 
        this.curIdx = i; 
        this.setHeight(); 
    }

    draw() {
        let newX = this.getNewPos();
        this.p5.fill(this.lightColor);
        this.p5.noStroke();

        //this.handleGrowState(LIGHT_TYPE.TOP);
        //this.handleGrowState(LIGHT_TYPE.BOTTOM);

        // Am I supposed to draw this top light? 
        if (this.canDraw(LIGHT_TYPE.TOP)) {
            let height = this.getHeight(LIGHT_TYPE.TOP);
            this.p5.rect(newX, this.pos['y'], this.lightWidth, -height);
        }

        // Am I supposed to draw this bottom light?
        if (this.canDraw(LIGHT_TYPE.BOTTOM)) {
            let height = this.getHeight(LIGHT_TYPE.BOTTOM);
            this.p5.rect(newX, this.pos['y'], this.lightWidth, height);    
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

    getHeight(lightType) {
        let heightState = LightConfigStore.getHeightState(this.curIdx);
        return heightState[lightType];
    }

    // Should this light be drawn? 
    canDraw(lightType) {
        let drawState = LightConfigStore.getDrawState(this.curIdx);
        return drawState[lightType]; // It's true or false
    }

    // Is this light on? 
    isOn(lightType) {
        let lightState = LightConfigStore.getLightState(this.curIdx);
        return lightState[lightType] === LIGHT_STATE.ON; 
    }

    setGrowState(isTop, state) {
        if (isTop) {
            this.topVal = state; 
        } else {
            this.bottomVal = state; 
        }
    }

    setDrawState(lightType, state) {
        LightConfigStore.setDrawState(this.curIdx, lightType, state); 
    }

    // Set light heights based on the light configurations.
    // Call this functions when new configs are received. 
    setHeight() {
        let lightState = LightConfigStore.getLightState(this.curIdx);         
        let onHeight = this.p5.height/2;
        let offHeight = 0;

        // TOP light. 
        let lightType = LIGHT_TYPE.TOP; 
        if (lightState[lightType] === LIGHT_STATE.ON) {
            LightConfigStore.setHeightState(this.curIdx, lightType, onHeight);
        }

        if (lightState[lightType] === LIGHT_STATE.OFF) {
            LightConfigStore.setHeightState(this.curIdx, lightType, offHeight);
        }

        // BOTTOM light. 
        lightType = LIGHT_TYPE.BOTTOM; 
        if (lightState[lightType] === LIGHT_STATE.ON) {
            LightConfigStore.setHeightState(this.curIdx, lightType, onHeight);
        }

        if (lightState[lightType] === LIGHT_STATE.OFF) {
            LightConfigStore.setHeightState(this.curIdx, lightType, offHeight);
        }
    }
}