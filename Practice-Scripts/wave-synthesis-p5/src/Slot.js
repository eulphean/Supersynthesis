class Slot {
    constructor(xPos, yPos, slotWidth) {
        this.pos = {'x' : xPos, 'y' : yPos}
        this.slotWidth = slotWidth; 

        // Slot point at the top. 
        this.topPos = {'x' : xPos, 'y' : yPos - Slot_Height};
        // Slot point at the bottom.
        this.bottomPos = {'x' : xPos, 'y' : yPos + Slot_Height};

        // TODO: Calculate this based on the last stored value in db. 
        this.topVal = int(random(0, 2)); // Integer (0 or 1)
        this.bottomVal = int(random(0, 2)); // Integer (0 or 1)

        this.slotColor = color('rgba(255, 255, 255, 0.75)');
        this.slotPointColor = color('green'); // Only debug. 
    }

    draw() {
        // Draw top slot if it's true.
        if (this.topVal == 1) {
           this.drawSlot(true);
        }
        
        // Draw bottom slot if it's true. 
        if (this.bottomVal == 1) {
            this.drawSlot(false);
        }

        // this.drawSlotPoint(this.pos); // Only for debug
    }

    drawSlot(top = true) {
        let newXpos = this.pos['x'] - this.slotWidth/2;
        fill(this.slotColor);
        noStroke();
        if (top) {
            rect(newXpos, this.pos['y'], this.slotWidth, -height/2);
            //this.drawSlotPoint(this.topPos);
        } else {
            rect(newXpos, this.pos['y'], this.slotWidth, height/2);
            //this.drawSlotPoint(this.topPos);
        }
    }

    drawSlotPoint(pos) {
        fill(this.slotPointColor)
        circle(pos['x'], pos['y'], 10);
    }
}
