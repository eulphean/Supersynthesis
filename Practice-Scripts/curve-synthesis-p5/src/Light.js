
class Light {
    constructor(x, y, maxHeight) {
        this.pos = createVector(x, y);
        this.height = 0;
        this.shouldGrow = false; 
        this.maxHeight = maxHeight

        this.topPos = createVector(x + 10, y);
    }

    draw() {
        if (this.shouldGrow) {
            if (this.height < this.maxHeight) {
                this.height += 5;
                this.topPos['y'] = this.mappedHeight();
            }
            rect(this.pos['x'], this.pos['y'], 20, -this.height);
        } 

        if (!this.shouldGrow) {
            if (this.height > 0) {
                this.height -= 5; 
                this.topPos['y'] = this.mappedHeight();
            }
            rect(this.pos['x'], this.pos['y'], 20, -this.height);
        }

        // fill('white');
        // noStroke();
        // ellipse(this.pos['x'], this.pos['y'], 15);
    }

    grow(state) {
        this.shouldGrow = state;
    }

    mappedHeight() {
        let newHeight = map(this.height, 0, this.maxHeight, this.maxHeight, 0);
        return newHeight; 
    }
}