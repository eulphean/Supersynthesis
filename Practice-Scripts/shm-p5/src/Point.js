class Point {
    constructor(x, y, angle) {
        this.pos = {
            'x': x,
            'y': y
        };
        
        this.angle = angle;
        this.ctrPt = width / 2; 

        // Map this angle between 0 to 2PI
        this.angle = map(this.angle, 0, Num_Bulbs-1, 0, 2*TWO_PI);
        this.pos['x'] = map(sin(this.angle), -1, 1, this.ctrPt - 50, this.ctrPt + 50);

        this.col = color('green');
    }

    update() {
        // this.pos['x'] = sin(this.angle * frameCount * SLOW_FACTOR);
        // this.pos['x'] = map(this.pos['x'], -1, 1, this.ctrPt - MAX_AMP/2, this.ctrPt + MAX_AMP/2);
    }

    draw() {
        this.update();
        fill(this.col);
        circle(this.pos['x'], this.pos['y'], 25);
    }
}