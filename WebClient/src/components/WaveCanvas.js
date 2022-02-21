/*
  Name: WaveCanvas.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: Class responsible to paint the interactive P5.js canvas.
*/

import React from 'react'
import Radium from 'radium'
import {color} from './CommonStyles'
import p5 from 'p5'
import LightManager from './LightManager'
import MeshManager from './MeshManager'
import BpmManager from './BpmManager'

var sketch = (s) => {
  let isUserInteracting = false;
  let lightManager, meshManager, bpmManager;
  s.setup = () => {
    let canvasContainer = s.select('#canvasContainer');
    let height = canvasContainer.height;
    s.createCanvas(window.innerWidth, height);

    lightManager = new LightManager(s);
    meshManager = new MeshManager(s);
    bpmManager = new BpmManager(s); 
    lightManager.setup();
  };

  s.draw = () => {
    s.background(s.color(0, 0, 0));  
    lightManager.draw(isUserInteracting, meshManager.ellipsePos, meshManager.boundaryWidth);
    s.drawCenterLine();
    meshManager.draw(isUserInteracting, lightManager.lights); 
    bpmManager.update(isUserInteracting, meshManager.ellipsePos, lightManager.lights);
  };

  s.drawCenterLine = () => {
    // Draw a center line. 
    s.stroke("black")
    s.strokeWeight(6)
    s.line(0, s.height/2, s.width, s.height/2)
  };

  s.mousePressed = () => {
    if (s.mouseY > s.height || s.mouseY < 0) {
      // Ignore. 
    } else {
      isUserInteracting = true; 
    }
  };

  s.mouseReleased = () => {
    isUserInteracting = false; 
  };
};

// s.windowResized = () => {
//   let height = 0.95 * window.innerHeight;
//   s.resizeCanvas(window.innerWidth, height); 
// }

const styles = {
  // TODO: Is this height logic going to scale?
  container: {
    backgroundColor: color.bgBlack,
    height: '82vh',
    margin: 0,
    padding: 0,
    zIndex: 1
  }
};

class WaveCanvas extends React.Component {
  constructor(props) {
    super(props);   
    this.containerRef = React.createRef();
    this.sketchRef = React.createRef(); 
  }

  componentDidMount() {
    console.log('Wave canvas mounted');    
    this.myP5 = new p5(sketch, this.sketchRef.current);
  }
  
  render() {
    return (
      <div id={'canvasContainer'} 
        ref={this.sketchRef} 
        style={styles.container}>
      </div>
    );
  }
}

export default Radium(WaveCanvas);