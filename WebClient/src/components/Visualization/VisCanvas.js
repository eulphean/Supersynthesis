/*
  Name: VisCanvas.js
  Author: Amay Kataria
  Date: 03/25/2024
  Description: A special canvas to render a data visualization of all the data that has been created here.
*/

import React, {useEffect, useRef} from 'react'
import FullDbConfigStore from '../../stores/FullDbConfigStore'
import Radium from 'radium'
import {color} from '../CommonStyles'
import VisLightManager from './VisLightManager'
import p5 from 'p5'

var sketch = (s) => { 
  let visLightManager; 
  s.setup = () => {
    let canvasContainer = s.select('#canvasContainer');
    let height = canvasContainer.height;
    s.createCanvas(window.innerWidth, height);
    visLightManager = new VisLightManager(s); 
    visLightManager.setup();
  };

  s.draw = () => {
    s.background(s.color(0, 0, 0));   
    // s.fill(0, 255, 0);
    // s.circle(s.width/2, s.height/2, 200);
    visLightManager.draw();
  };

  s.windowResized = () => {
    setTimeout(() => {
      console.log('Canvas Resized.');
      let canvasContainer = s.select('#canvasContainer');
      let height = canvasContainer.height;
      s.resizeCanvas(window.innerWidth, height); 

      visLightManager.prepareLights();
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

    const processDbConfigs = (data) => {
      
    }

    useEffect(() => {
        console.log('New Sketch');
        // Save the value for the ref here. 
        myP5.current = new p5(sketch, sketchRef.current); 
        FullDbConfigStore.subscribeForDbConfigs(processDbConfigs);
        FullDbConfigStore.getLightConfigs();
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