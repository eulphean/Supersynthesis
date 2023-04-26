/*
  Name: Light.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: A class representing each light that is painted on the canvas. 
*/
import LightConfigStore, { LIGHT_STATE, GROW_STATE } from "../stores/LightConfigStore";
import SequencerStore from '../stores/SequencerStore';
import EditModeStore from "../stores/EditModeStore";
import ModeStore, { MODE } from "../stores/ModeStore";

export default class Light {
    constructor(s, i, xPos, yPos, lightWidth) {
        // Sketch object. 
        this.p5 = s; 

        // Light's width. 
        this.lightWidth = lightWidth;

        this.growFactor = this.p5.random(1.5, 2.5);

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
        this.updateHeight(); 

        // Variable for the timer's interval id. 
        this.growIntervalId = ''; 
        setInterval(this.randomizeGrowState.bind(this), 500); 
    }


    draw(meshEllipsePos, boundaryWidth) {
        let isEditMode = EditModeStore.isEditMode; 
        let newX = this.getNewPos();
        this.p5.noStroke();

        // Draw the background lights.
        this.p5.fill(this.lightBgColor);        
        this.p5.rect(newX, this.pos['y'], this.lightWidth, -this.p5.height);

        // This is great logic for scoring and other things. Right now I need to figure 
        // out the logic for the keyboard.
        // NOTE: Commenting this out briefly.
        if (isEditMode) {
            this.updateLight(meshEllipsePos, boundaryWidth);            
            // Draw the actual light. 
            let height = this.getHeight();
            this.p5.fill(this.lightActiveColor);
            this.p5.rect(newX, this.pos['y'], this.lightWidth, -height);  
        } else {
            // Draw the actual lights from the DB config that are lighting. 
            if (this.isOnFromDb()  || ModeStore.getCurrentMode() === MODE.SWEEP) {
                this.p5.fill(this.lightInactiveColor);
                this.p5.rect(newX, this.pos['y'], this.lightWidth, -this.p5.height);
            }

            // Draw the lights from the db config that should be on. 
            if (this.canDraw()) {
                // Draw full light.
                this.p5.fill(this.lightActiveColor);
                this.p5.rect(newX, this.pos['y'], this.lightWidth, -this.p5.height);  
            }
        }

        // this.drawLightPoint();
    }

    updateLight(meshEllipsePos, boundaryWidth) {
        let isUserInteracting = EditModeStore.isUserInteracting;
        if (isUserInteracting) {
            let dBottomPos = meshEllipsePos.dist(this.pos);
            let dTopPos = meshEllipsePos.dist(this.top);
            if (dBottomPos < boundaryWidth/2 || dTopPos < boundaryWidth/2) {
                // This light is activated, grow or shrink. 
                this.updateGrowState();
            }
        }

        this.handleGrowState();
    }

    
    updateGrowState() {
        let curLightState = LightConfigStore.getActiveLightState(this.curIdx);
        let curGrowState = LightConfigStore.getGrowState(this.curIdx); 

        // Is the light on? 
        if (curLightState === LIGHT_STATE.ON) {
            // Is this light currently growing or shrinking? 
            if (curGrowState['active']) {
                // I'm doing something - let's not do anything. 
            } else {
                // Is the state set to shrink? Because it can only shrink. 
                if (curGrowState['state'] === GROW_STATE.SHRINK) {
                    LightConfigStore.setGrowState(this.curIdx, GROW_STATE.SHRINK, true);
                    // This light will not be turned on anymore.  
                    LightConfigStore.setActiveLightState(this.curIdx, LIGHT_STATE.OFF);                
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
                    LightConfigStore.setGrowState(this.curIdx, GROW_STATE.GROW, true);
                    // This light will not be turned on anymore.  
                    LightConfigStore.setActiveLightState(this.curIdx, LIGHT_STATE.ON);
                } else {
                    // Pass, we can't shrink a light that's already off. 
                }
            }
        }
    }
    
    // Grow & Shrink the height of the light.
    handleGrowState() {
        let curGrowthActive = this.getGrowState()['active'];
        let curGrowState = this.getGrowState()['state'];
        let curHeight = this.getHeight();

        // Is the current light's grow active? 
        if (curGrowthActive) {
            switch (curGrowState) {
                case GROW_STATE.NONE: {
                    // Pass don't do antyhing. 
                    break;
                }
    
                case GROW_STATE.GROW: {
                    if (curHeight < this.p5.height) {
                        curHeight += this.growFactor;
                        LightConfigStore.setHeightState(this.curIdx, curHeight);
                        this.mapPos(curHeight);
                    } else {
                        // Deactivate the current light. 
                        LightConfigStore.setGrowState(this.curIdx, GROW_STATE.NONE, false);
                    }
                    break;
                }
    
                case GROW_STATE.SHRINK: {
                    if (curHeight > 0) {
                        curHeight -= this.growFactor; 
                        LightConfigStore.setHeightState(this.curIdx, curHeight);
                        this.mapPos(curHeight);
                    } else {
                        // Deactivate the current light. 
                        LightConfigStore.setGrowState(this.curIdx,  GROW_STATE.NONE, false);
                    }
                    break;
                }
    
                default: 
                    break;
            }
        }
    }
    
    // Set light heights based on the light configurations.
    // Call this functions when new configs are received. 
    updateHeight() {
        let lightState = LightConfigStore.getActiveLightState(this.curIdx);         
        let onHeight = this.p5.height;
        let offHeight = 0;

        if (lightState === LIGHT_STATE.ON) {
            LightConfigStore.setHeightState(this.curIdx, onHeight);
        }

        if (lightState === LIGHT_STATE.OFF) {
            LightConfigStore.setHeightState(this.curIdx, offHeight);
        }
    }

    mapPos( height) {
        this.topPos['y'] = this.p5.map(height, 0, this.p5.height, this.p5.height, 0);
    }

    drawLightPoint() {
        let newX = this.getNewPos();
        this.p5.fill(this.lightPointColor)
        this.p5.circle(newX, this.pos['y'], 5);
    }
    
    getNewPos() {
        return this.pos['x'] + this.lightWidth/2; 
    }

    getGrowState() {
        return LightConfigStore.getGrowState(this.curIdx);
    }

    getHeight() {
        let heightState = LightConfigStore.getHeightState(this.curIdx);
        return heightState;
    }

    canDraw() {
        let drawState = SequencerStore.getLightState(this.curIdx);
        return drawState; // It's true or false. 
    }

    isOn() {
        let lightState = LightConfigStore.getActiveLightState(this.curIdx);
        return lightState; 
    }

    isOnFromDb() {
        let lightState = LightConfigStore.getDbLightState(this.curIdx);
        return lightState; 
    }

    isGrowing() {
        let v = LightConfigStore.getGrowState(this.curIdx)['active'];
        return v;
    }

    updateDrawState(state) {
        LightConfigStore.setDrawState(this.curIdx, state); 
    }

    randomizeGrowState() {
        let calcGrowState = () => {
            let curGrowState = this.getGrowState(); 
            if (curGrowState['active']) {                
                // I'm currently growing or doing something. 
                // Pass
            } else {
                // Update my state. 
                let r = this.p5.int(this.p5.random(0, 2)); 
                r = r === 1 ? GROW_STATE.GROW : GROW_STATE.SHRINK;
                LightConfigStore.setGrowState(this.curIdx, r, false);
            }
        }

        // Set new grow states for top and bottom light for the current light. 
        calcGrowState();        
    }
}