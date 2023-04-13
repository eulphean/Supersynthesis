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
import LightManager from './LightManager'
import MeshManager from './MeshManager'
import BpmManager from './BpmManager'
import TimerStore from '../stores/TimerStore'
import LightConfigStore from '../stores/LightConfigStore'
import PianoRoll from './PianoRoll'

var sketch = (s) => {
  let lightManager, meshManager, bpmManager;
  let shouldTrigger = false; 
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
    lightManager.draw(meshManager.ellipsePos, meshManager.boundaryWidth);
    meshManager.draw(lightManager.lights); 
    bpmManager.update(meshManager.ellipsePos, lightManager.lights);
  };

  s.mousePressed = () => {
    if (s.mouseY > s.height || s.mouseY < 0) {
      // Ignore. 
    } else if (!EditModeStore.isPopupActive) {
      console.log('Doing it');
      EditModeStore.setUserInteracting(true); 
      EditModeStore.setEditMode(true);
      TimerStore.cancelReset();
      shouldTrigger = true; 
    }
  };

  s.mouseReleased = () => {
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
    WebkitOverflowScrolling: 'touch',
    backgroundColor: color.bgBlack,
    margin: 0,
    padding: 0,
    zIndex: '1'
  },

  hideCanvas: {
    display: 'none'
  },

  showCanvas: {
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
    if (this.state.currentMode === MODE.SCORE) {
      // Don't recreate the sketch.
      if (!this.doesSketchExist) {
        console.log('New Sketch');
        this.myP5 = new p5(sketch, this.sketchRef.current);   
        this.doesSketchExist = true;
      }
    }
  }
  
  render() {     
    let heightStyle = this.getHeightStyle();
    let containerStyle = [styles.container, heightStyle];
    if (this.state.currentMode === MODE.SCORE) {
      console.log("HELLO SCORE");
    }
    let canvasStyle = this.state.currentMode === MODE.SCORE ? [containerStyle, styles.showCanvas] : [containerStyle, styles.hideCanvas];
    let pianoStyle = this.state.currentMode === MODE.SYNTH ? [containerStyle, styles.showCanvas] : [containerStyle, styles.hideCanvas];
    return (
      <>
          <div id={'canvasContainer'} 
            ref={this.sketchRef} 
            style={canvasStyle}>
          </div>
          <PianoRoll wrapperStyle={pianoStyle} />
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