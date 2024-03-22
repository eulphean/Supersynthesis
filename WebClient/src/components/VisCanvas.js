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

var sketch = (s) => { 
  s.setup = () => {
    let canvasContainer = s.select('#canvasContainer');
    let height = canvasContainer.height;
    s.createCanvas(window.innerWidth, height);
  };

  s.draw = () => {
    s.background(s.color(255, 0, 0));  
    s.fill(0, 255, 0);
    s.circle(s.width/2, s.height/2, 200);
  };

  s.windowResized = () => {
    setTimeout(() => {
      console.log('Canvas Resized.');
      let canvasContainer = s.select('#canvasContainer');
      let height = canvasContainer.height;
      s.resizeCanvas(window.innerWidth, height); 
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

class VisCanvas extends React.Component {
  constructor(props) {
    super(props);   
    this.containerRef = React.createRef();
    this.sketchRef = React.createRef(); 
    this.doesSketchExist = false; 

    this.state = {
    }
  }

  componentDidMount() {
    console.log('Wave canvas mounted');    
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
      </>
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
    let c = 1; 
    // if (this.props.orientation === ORIENTATION.PORTRAIT) {
    //   if (deviceHeight < 900) {
    //     c = 0.8;
    //   }

    //   if (deviceHeight > 900 && deviceHeight < 1000) {
    //     c = 0.85;
    //   }

    //   if (deviceHeight > 1000) {
    //     c = 0.88; 
    //   }
    // }

    // if (this.props.orientation === ORIENTATION.LANDSCAPE) {
    //   if (deviceWidth < 1000) {
    //     c = 0.70;  
    //   } 

    //   if (deviceWidth > 1000) {
    //     c = 0.82;
    //   }
    // }

    return deviceHeight * c;
  }
}

export default Radium(VisCanvas);