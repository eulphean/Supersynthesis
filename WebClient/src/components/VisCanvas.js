/*
  Name: WaveCanvas.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: Class responsible to paint the interactive P5.js canvas.
*/

import React, {useEffect, useRef} from 'react'
import Websocket from './Websocket'
import Radium from 'radium'
import {color} from './CommonStyles'
import p5 from 'p5'

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

function VisCanvas(props) {
    let sketchRef = useRef();
    let myP5 = useRef()

    useEffect(() => {
        console.log('New Sketch');
        // Save the value for the ref here. 
        myP5.current = new p5(sketch, sketchRef.current); 
        
        console.log('Exclusively fetching all database data to render');
        Websocket.fetchFullDatabase();
    }, []);

    const getHeight = (() => {
        let deviceHeight = window.innerHeight;
        return deviceHeight;
    })

    const getHeightStyle = (() => {
        let height = getHeight();
        let heightStyle = {
            height: height + 'px'
        };
        return heightStyle; 
    })

    let heightStyle = getHeightStyle();
    let containerStyle = [styles.container, heightStyle];
    let canvasStyle = [containerStyle, styles.show];
    return (
        <>
            <div id={'canvasContainer'} 
              ref={sketchRef} 
              style={canvasStyle}>
            </div>
        </>
    );
}

export default Radium(VisCanvas);