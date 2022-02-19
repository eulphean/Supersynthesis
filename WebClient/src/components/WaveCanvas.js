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

var sketch = (s) => {
  let isUserInteracting = false;
  let lightManager, meshManager; 
  s.setup = () => {
    let canvasContainer = s.select('#canvasContainer');
    let height = canvasContainer.height;
    s.createCanvas(window.innerWidth, height);

    lightManager = new LightManager(s);
    meshManager = new MeshManager(s);
    lightManager.setup();
  };

  s.draw = () => {
    s.background(s.color(0, 0, 0));  
    lightManager.draw(isUserInteracting, meshManager.ellipsePos);
    s.drawCenterLine();
    meshManager.draw(isUserInteracting, lightManager.lights); 
  };

  s.drawCenterLine = () => {
    // Draw a center line. 
    s.stroke("black")
    s.strokeWeight(6)
    s.line(0, s.height/2, s.width, s.height/2)
  };

  s.mousePressed = () => {
    isUserInteracting = true; 
  };

  s.mouseReleased = () => {
    isUserInteracting = false; 
  };

  // s.keyPressed = () => {
  //   if (s.keyCode == 32) {
  //       lightManager.createNewLightConfig(); 
  //   }
  // };
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
    padding: 0
  }
};

class WaveCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state={

    };
    
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