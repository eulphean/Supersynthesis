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
import EditModeStore from '../stores/EditModeStore'
import ModeStore, {MODE} from '../stores/ModeStore'
import TouchStore from '../stores/TouchStore'
import LightManager from './LightManager'
import MeshManager from './MeshManager'
import TouchEllipseManager from './TouchEllipseManager'
import BpmManager from './BpmManager'
import TimerStore from '../stores/TimerStore'
import LightConfigStore from '../stores/LightConfigStore'

var sketch = (s) => {
  let lightManager, meshManager, bpmManager, touchEllipseManager; 
  let shouldTrigger = false; 
  s.setup = () => {
    let canvasContainer = s.select('#canvasContainer');
    let height = canvasContainer.height;
    s.createCanvas(window.innerWidth, height);

    lightManager = new LightManager(s);
    meshManager = new MeshManager(s);
    bpmManager = new BpmManager(s); 
    touchEllipseManager = new TouchEllipseManager(s);

    lightManager.setup();
  };

  s.draw = () => {
    s.background(s.color(0, 0, 0));  
    lightManager.draw(meshManager.ellipsePos, meshManager.boundaryWidth);
    meshManager.draw(lightManager.lights); 
    bpmManager.update(meshManager.ellipsePos, lightManager.lights);
    touchEllipseManager.draw();
  };

  s.mousePressed = () => {
    TouchStore.setTouches(s.touches);
    const currentMode = ModeStore.currentMode; 
    // For score mode, we do good things. 
    if (currentMode === MODE.SCORE) {
      if (s.mouseY > s.height || s.mouseY < 0) {
        // Ignore. 
      } else if (!EditModeStore.isPopupActive) {
        console.log('Doing it');
        EditModeStore.setUserInteracting(true); 
        EditModeStore.setEditMode(true);
        TimerStore.cancelReset();
        shouldTrigger = true; 
      }
    }
  };

  s.mouseMoved = () => {
    const mouseVal = {x: s.mouseX, y: s.mouseY};
    TouchStore.setTouches([mouseVal]);
  }

  s.touchMoved = () => {
    TouchStore.setTouches(s.touches);
  }

  s.touchEnded = () => {
    TouchStore.setTouches(s.touches);
    if (!EditModeStore.isPopupActive) {
      EditModeStore.setUserInteracting(false); 
      let hasConfigEdited = LightConfigStore.hasConfigEdited;
      if (shouldTrigger && hasConfigEdited) {
        console.log('Schedule popup')
        TimerStore.startTimer();
        shouldTrigger = false;
      }
    }
  }

  s.windowResized = () => {
    setTimeout(() => {
      console.log('Canvas Resized.');
      let canvasContainer = s.select('#canvasContainer');
      let height = canvasContainer.height;
      s.resizeCanvas(window.innerWidth, height); 
  
      // Prepare the lights again. 
      lightManager.prepareLights();
    }, 500);
  }
};

const styles = {
  container: {
    position: 'relative',
    backgroundColor: color.bgBlack,
    margin: 0,
    padding: 0,
    outline: 'none',
    zIndex: '1'
  },

  hide: {
    display: 'none'
  },

  show: {
    display: 'inline'
  }
};

class WaveCanvas extends React.Component {
  constructor(props) {
    super(props);   
    this.containerRef = React.createRef();
    this.sketchRef = React.createRef(); 
    this.doesSketchExist = false; 

    this.state = {
      currentMode: ModeStore.getCurrentMode()
    }
  }

  componentDidMount() {
    console.log('Wave canvas mounted');    
    ModeStore.subscribe(this.onModeUpdate.bind(this)); 
  }

  componentDidUpdate() {
      // Don't recreate the sketch.
      if (!this.doesSketchExist) {
        console.log('New Sketch');
        this.myP5 = new p5(sketch, this.sketchRef.current);   
        this.doesSketchExist = true;
      }
  }
  
  render() {     
    let heightStyle = this.getHeightStyle();
    let containerStyle = [styles.container, heightStyle];
    let canvasStyle = [containerStyle, styles.show];
    return (
      <>
          <div id={'canvasContainer'} 
            ref={this.sketchRef} 
            style={canvasStyle}>
          </div>
          {/* <Synth wrapperStyle={synthStyle} /> */}
      </>
    );
  }

  onModeUpdate(newMode) {
    this.setState({
      currentMode: newMode
    });
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