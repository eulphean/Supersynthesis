// Handles individual light. 
const LIGHT_TYPE = {
    TOP: 'TOP',
    BOTTOM: 'BOTTOM'
};

const LIGHT_STATE = {
    ON: 1,
    OFF: 0
};

const GROW_STATE = {
    NONE: 0,
    GROW: 1,
    SHRINK: 2
}

const GROW_FACTOR = 2.5;

class Light {
    constructor(xPos, yPos, lightWidth) {
        // Light's width. 
        this.lightWidth = lightWidth;

        // Origin point at the center.
        this.pos = createVector(xPos, yPos);
        
        let newX = this.getNewPos() + this.lightWidth/2; // Keep this at the center of the light.
        // Point at the top. 
        this.topPos = createVector(newX, yPos - height/2);
        // Point at the bottom.
        this.bottomPos = createVector(newX, yPos + height/2);        
        
        // Create original config.
        // TODO: This config will come from the database.  
        this.originalState = {
            'TOP': -1,
            'BOTTOM': -1
        }; 
        this.localState = {
            'TOP': -1,
            'BOTTOM': -1
        }
        this.drawState = {
            'TOP': -1,
            'BOTTOM': -1
        }
        this.growState = {
            'TOP': GROW_STATE.NONE,
            'BOTTOM': GROW_STATE.NONE
        }
        // Object to control the height of the lights. 
        this.movingHeight = {
            'TOP': 0,
            'BOTTOM': 0
        };
        // Sets an original state and copies it into Local State
        this.setOriginalState();
        this.setMovingHeight();
        // Colors. 
        this.lightColor = color('white');
        this.lightPointColor = color('green'); // Only debug.
    }

    draw() {
        let newX = this.getNewPos();
        fill(this.lightColor);
        noStroke();

        this.handleGrowState(LIGHT_TYPE.TOP);
        this.handleGrowState(LIGHT_TYPE.BOTTOM);

        // Am I supposed to draw this top light? 
        if (this.drawState[LIGHT_TYPE.TOP] === LIGHT_STATE.ON) {
            rect(newX, this.pos['y'], this.lightWidth, -this.movingHeight['TOP']);
        }

        // Am I supposed to draw this bottom light?
        if (this.drawState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON) {
            rect(newX, this.pos['y'], this.lightWidth, this.movingHeight['BOTTOM']);    
        }
    }

    handleGrowState(lightType) {
        switch (this.growState[lightType]) {
            case GROW_STATE.NONE: {
                // Pass don't do antyhing. 
                break;
            }

            case GROW_STATE.GROW: {
                if (this.movingHeight[lightType] < height/2) {
                    this.movingHeight[lightType] += GROW_FACTOR;
                    this.mapPos(lightType);
                }
                break;
            }

            case GROW_STATE.SHRINK: {
                if (this.movingHeight[lightType] > 0) {
                    this.movingHeight[lightType] -= GROW_FACTOR; 
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
            this.topPos['y'] = map(this.movingHeight[LIGHT_TYPE.TOP], 0, height/2, height/2, 0);
        } else {
            this.bottomPos['y'] = map(this.movingHeight[LIGHT_TYPE.BOTTOM], 0, height/2, height/2, height);
        }
    }

    drawLightPoint(pos) {
        let newX = this.getNewPos();
        fill(this.lightPointColor)
        circle(newX, this.pos['y'], 10);
    }
    
    getNewPos() {
        return this.pos['x'] + this.lightWidth/2; 
    }

    // Store temporary state in local state. 
    setLocalState(lightType, lightState) {
        this.localState[lightType] = lightState;
    }

    // Only the draw state is stored here. 
    setDrawState(lightType, lightState) {
        this.drawState[lightType] = lightState;
    }

    setOriginalState() {
        // TODO: GET THIS FROM THE DATABASE. 
        let topVal = int(random(0, 2)); // Integer (0 or 1)
        let bottomVal = int(random(0, 2)); // Integer (0 or 1)   
        this.originalState = {
            'TOP': topVal,
            'BOTTOM' : bottomVal
        } 
        this.localState = {
            'TOP': topVal,
            'BOTTOM' : bottomVal
        }
    }

    updateGrowState(isTop, state) {
        if (isTop) {
            this.topVal = state; 
        } else {
            this.bottomVal = state; 
        }
    }

    setMovingHeight() {
        if (this.localState[LIGHT_TYPE.TOP] === LIGHT_STATE.ON) {
            this.movingHeight[LIGHT_TYPE.TOP] = height/2;
        }

        if (this.localState[LIGHT_TYPE.TOP] === LIGHT_STATE.OFF) {
            this.movingHeight[LIGHT_TYPE.TOP] = 0;
        }

        if (this.localState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON) {
            this.movingHeight[LIGHT_TYPE.BOTTOM] = height/2;
        }

        if (this.localState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.OFF) {
            this.movingHeight[LIGHT_TYPE.BOTTOM] = 0;
        }
    }
}