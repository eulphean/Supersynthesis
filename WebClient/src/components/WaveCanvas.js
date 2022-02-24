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
import { ORIENTATION } from './App'
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
    // s.drawCenterLine(isUserInteracting);
    meshManager.draw(isUserInteracting, lightManager.lights); 
    bpmManager.update(isUserInteracting, meshManager.ellipsePos, lightManager.lights);
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

  s.windowResized = () => {
    console.log('Canvas Resized.');
    let canvasContainer = s.select('#canvasContainer');
    let height = canvasContainer.height;
    s.resizeCanvas(window.innerWidth, height); 

    // Prepare the lights again. 
    lightManager.prepareLights();
  }
};

const styles = {
  container: {
    position: 'relative',
    backgroundColor: color.bgBlack,
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
    let heightStyle = this.getHeightStyle();
    let containerStyle = [styles.container, heightStyle];
    return (
      <div id={'canvasContainer'} 
        ref={this.sketchRef} 
        style={containerStyle}>
      </div>
    );
  }

  getHeightStyle() {
    let height = this.getHeight();
    let heightStyle = {
      height: height + 'px'
    };
    return heightStyle; 
  }

  getHeight() {
    let deviceHeight = window.innerHeight;
    let deviceWidth = window.innerWidth; 
    let c = 0; 
    if (this.props.orientation === ORIENTATION.PORTRAIT) {
      if (deviceHeight < 900) {
        c = 0.8;
      }

      if (deviceHeight > 900 && deviceHeight < 1000) {
        c = 0.85;
      }

      if (deviceHeight > 1000) {
        c = 0.88; 
      }
    }

    if (this.props.orientation === ORIENTATION.LANDSCAPE) {
      if (deviceWidth < 1000) {
        c = 0.70;  
      } 

      if (deviceWidth > 1000) {
        c = 0.82;
      }
    }

    return deviceHeight * c;
  }
}

export default Radium(WaveCanvas);