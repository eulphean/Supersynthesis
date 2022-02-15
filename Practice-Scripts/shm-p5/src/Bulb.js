class Bulb {
    constructor(x, y, angle) {
        // Position object
        this.pos = {
            x: x,
            y: y
        }
        this.angle = angle;
        this.ctrPt = width / 2; 
        this.prevY = this.pos['y'];
        this.col = color('red')
    }

    draw(points) {
        this.pos['x'] = sin(this.angle * SLOW_FACTOR * frameCount);
        this.pos['x'] = map(this.pos['x'], -1, 1, this.ctrPt - MAX_AMP, this.ctrPt + MAX_AMP);
        
        let idx = this.angle - 1; 
        // let ctrPt = points[idx].pos['x']; 
        let ctrPt = width/2;

        // Downward crossing.
        if (this.pos['x'] > ctrPt && this.prevY < ctrPt)
        {
            // We just crossed the center while going down. 
            this.col = color('white');
        } else if (this.pos['x'] < ctrPt && this.prevY > ctrPt)
        {
            this.col = color('white');
        } else {
            this.col = color('red');
        }

        // Capture the previous value.
        this.prevY = this.pos['x']; 
        fill(this.col);
        circle(this.pos['x'], this.pos['y'], 60);
    }
}