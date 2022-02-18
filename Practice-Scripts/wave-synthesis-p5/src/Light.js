// Handles individual light. 
const LIGHT_TYPE = {
    TOP: 'TOP',
    BOTTOM: 'BOTTOM'
};

const LIGHT_STATE = {
    ON: 1,
    OFF: 0
};

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
        
        // Create a default config. 
        // TODO: This config will be populated from an incoming
        // message from the database. 
        this.configState = {}; 
        this.updateStateConfig();

        // Local object to keep track if the light is drawn currently
        // on the screen or not. This is only for drawing purposes. 
        this.tempDrawState = {
            'TOP': LIGHT_STATE.OFF,
            'BOTTOM': LIGHT_STATE.OFF
        }

        // Colors. 
        this.lightColor = color('white');
        this.lightPointColor = color('green'); // Only debug.
    }

    draw() {
        let newX = this.getNewPos();
        fill(this.lightColor);
        noStroke();

        // Am I supposed to draw this top light? 
        if (this.tempDrawState[LIGHT_TYPE.TOP] === LIGHT_STATE.ON) {
            rect(newX, this.pos['y'], this.lightWidth, -height/2);
        }

        // Am I supposed to draw this bottom light?
        if (this.tempDrawState[LIGHT_TYPE.BOTTOM] === LIGHT_STATE.ON) {
            rect(newX, this.pos['y'], this.lightWidth, height/2);    
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

    // We need the onState for both top and bottom lights. 
    setDrawState(lightType, lightState) {
        this.tempDrawState[lightType] = lightState;
    }

    updateStateConfig() {
        // TODO: GET THIS FROM THE DATABASE. 
        let topVal = int(random(0, 2)); // Integer (0 or 1)
        let bottomVal = int(random(0, 2)); // Integer (0 or 1)   
        this.configState = {
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
}