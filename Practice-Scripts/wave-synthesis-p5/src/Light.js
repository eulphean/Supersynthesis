// Handles individual light. 
class Light {
    constructor(xPos, yPos, lightWidth) {
        // Light's width. 
        this.lightWidth = lightWidth;

        // Origin point at the center.
        this.pos = {'x' : xPos, 'y' : yPos}
        // Point at the top. 
        let newX = this.getNewPos() + this.lightWidth/2; // Keep this at the center of the light.
        this.topPos = {'x' : newX, 'y' : yPos - height/2};
        // Point at the bottom.
        this.bottomPos = {'x' : newX, 'y' : yPos + height/2};        
        
        this.lightColor = COL_WHITE;
        this.lightPointColor = color('green'); // Only debug. 
        
        // TODO: Calculate this based on the last stored value in db. 
        this.topVal = int(random(0, 2)); // Integer (0 or 1)
        this.bottomVal = int(random(0, 2)); // Integer (0 or 1)     

        // [Top, bottom] on state for the light. 
        this.onState = [false, false]; 
    }

    draw() {
        // Draw top slot if it's true.
        if (this.topVal == 1) {
           this.drawLight(true);
        }
        
        // // Draw bottom slot if it's true. 
        if (this.bottomVal == 1) {
            this.drawLight(false);
        }
    }

    drawLight(isTop) {
        let newX = this.getNewPos();
        fill(this.lightColor);
        noStroke();

        if (this.onState[0] && isTop) {
            rect(newX, this.pos['y'], this.lightWidth, -height/2);
        }

        if (this.onState[1] && !isTop) {
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
    setOnState(isTop, state) {
        let idx = isTop ? 0 : 1;
        this.onState[idx] = state;
    }
}