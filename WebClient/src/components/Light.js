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
        this.updateHeight(); 

        // Variable for the timer's interval id. 
        this.growIntervalId = ''; 
        setInterval(this.randomizeGrowState.bind(this), 3000); 
    }

    draw(isUserInteracting, isCurrentlyGrowing) {
        let newX = this.getNewPos();
        this.p5.fill(this.lightColor);
        this.p5.noStroke();

        // If user is interacting? Draw everything
        if (isUserInteracting || isCurrentlyGrowing) {
            this.handleGrowState(LIGHT_TYPE.TOP);
            this.handleGrowState(LIGHT_TYPE.BOTTOM);

            let height = this.getHeight(LIGHT_TYPE.TOP);
            this.p5.rect(newX, this.pos['y'], this.lightWidth, -height);

            height = this.getHeight(LIGHT_TYPE.BOTTOM);
            this.p5.rect(newX, this.pos['y'], this.lightWidth, height);  
        } else {
             // Am I supposed to draw this top light? 
            if (this.canDraw(LIGHT_TYPE.TOP)) {
                // let height = this.getHeight(LIGHT_TYPE.TOP);
                this.p5.rect(newX, this.pos['y'], this.lightWidth, -this.p5.height/2);
            }

            // Am I supposed to draw this bottom light?
            if (this.canDraw(LIGHT_TYPE.BOTTOM)) {
                // let height = this.getHeight(LIGHT_TYPE.BOTTOM);
                this.p5.rect(newX, this.pos['y'], this.lightWidth, this.p5.height/2);    
            }
        }

        // this.drawLightPoint();
    }
    
    randomizeGrowState() {
        let calcGrowState = (lightType) => {
            let curGrowState = this.getGrowState(lightType); 
            if (curGrowState['active']) {                
                // I'm currently growing or doing something. 
                // Pass
            } else {
                // Update my state. 
                let r = this.p5.int(this.p5.random(0, 2)); 
                r = r === 1 ? GROW_STATE.GROW : GROW_STATE.SHRINK;
                LightConfigStore.setGrowState(this.curIdx, lightType, r, false);
            }
        }

        // Set new grow states for top and bottom light for the current light. 
        calcGrowState(LIGHT_TYPE.TOP);
        calcGrowState(LIGHT_TYPE.BOTTOM);           
    }

    // Grow & Shrink the height of the light.
    handleGrowState(lightType) {
        let curGrowthActive = this.getGrowState(lightType)['active'];
        let curGrowState = this.getGrowState(lightType)['state'];
        let curHeight = this.getHeight(lightType);

        // Is the current light's grow active? 
        if (curGrowthActive) {
            switch (curGrowState) {
                case GROW_STATE.NONE: {
                    // Pass don't do antyhing. 
                    break;
                }
    
                case GROW_STATE.GROW: {
                    if (curHeight < this.p5.height/2) {
                        curHeight += GROW_FACTOR;
                        LightConfigStore.setHeightState(this.curIdx, lightType, curHeight);
                        // this.mapPos(lightType);
                    } else {
                        // Deactivate the current light. 
                        LightConfigStore.setGrowState(this.curIdx, lightType, GROW_STATE.NONE, false);
                    }
                    break;
                }
    
                case GROW_STATE.SHRINK: {
                    if (curHeight > 0) {
                        curHeight -= GROW_FACTOR; 
                        LightConfigStore.setHeightState(this.curIdx, lightType, curHeight);
                        // this.mapPos(lightType);
                    } else {
                        // Deactivate the current light. 
                        LightConfigStore.setGrowState(this.curIdx, lightType, GROW_STATE.NONE, false);
                    }
                    break;
                }
    
                default: 
                    break;
            }
        }
    }

    mapPos(lightType) {
        if (lightType === LIGHT_TYPE.TOP) {
            this.topPos['y'] = this.p5.map(this.lightHeight[LIGHT_TYPE.TOP], 0, this.p5.height/2, this.p5.height/2, 0);
        } else {
            this.bottomPos['y'] = this.p5.map(this.lightHeight[LIGHT_TYPE.BOTTOM], 0, this.p5.height/2, this.p5.height/2, this.p5.height);
        }
    }

    drawLightPoint() {
        let newX = this.getNewPos();
        this.p5.fill(this.lightPointColor)
        this.p5.circle(newX, this.pos['y'], 10);
    }
    
    getNewPos() {
        return this.pos['x'] + this.lightWidth/2; 
    }

    getGrowState(lightType) {
        return LightConfigStore.getGrowState(this.curIdx)[lightType];
    }

    getHeight(lightType) {
        let heightState = LightConfigStore.getHeightState(this.curIdx);
        return heightState[lightType];
    }

    // Should this light be drawn? 
    canDraw(lightType) {
        let drawState = LightConfigStore.getDrawState(this.curIdx);
        return drawState[lightType]; // It's true or false. 
    }

    // Is this light on? 
    isOn(lightType) {
        let lightState = LightConfigStore.getLightState(this.curIdx);
        return lightState[lightType] === LIGHT_STATE.ON; 
    }

    isGrowing(lightType) {
        let v = LightConfigStore.getGrowState(this.curIdx)[lightType]['active'];
        return v;
    }

    updateGrowState(lightType) {
        let curLightState = LightConfigStore.getLightState(this.curIdx)[lightType];
        let curGrowState = LightConfigStore.getGrowState(this.curIdx)[lightType]; 

        // Is the light on? 
        if (curLightState === LIGHT_STATE.ON) {
            // Is this light currently growing or shrinking? 
            if (curGrowState['active']) {
                // I'm doing something - let's not do anything. 
            } else {
                // Is the state set to shrink? Because it can only shrink. 
                if (curGrowState['state'] === GROW_STATE.SHRINK) {
                    LightConfigStore.setGrowState(this.curIdx, lightType, GROW_STATE.SHRINK, true);
                    // This light will not be turned on anymore.  
                    LightConfigStore.setLightState(this.curIdx, lightType, LIGHT_STATE.OFF);                
                } else {
                    // Pass, we can't grow a light that's already on. 

                }
            }
        }

        if (curLightState === LIGHT_STATE.OFF) {
            if (curGrowState['active']) {
                // I'm doing something - let's not do anything. 
            } else {
                if (curGrowState['state'] === GROW_STATE.GROW) {
                    LightConfigStore.setGrowState(this.curIdx, lightType, GROW_STATE.GROW, true);
                    // This light will not be turned on anymore.  
                    LightConfigStore.setLightState(this.curIdx, lightType, LIGHT_STATE.ON);
                } else {
                    // Pass, we can't shrink a light that's already off. 
                }
            }
        }
    }

    updateDrawState(lightType, state) {
        LightConfigStore.setDrawState(this.curIdx, lightType, state); 
    }

    // Set light heights based on the light configurations.
    // Call this functions when new configs are received. 
    updateHeight() {
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


    // Fired when new light updates are received. 
    // updateLights() {
    //     console.log('New lights received: Update the light heights.');
    //     for (let i = 0; i < NUM_LIGHTS; i++) {
    //         let l = this.lights[i]; 
    //         // let configState = LightConfigStore.getState(i);
    //         // l.setHeight(configState);
    //     }
    // }