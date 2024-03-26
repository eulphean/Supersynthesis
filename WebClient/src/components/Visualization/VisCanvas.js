/*
  Name: VisCanvas.js
  Author: Amay Kataria
  Date: 03/25/2024
  Description: A special canvas to render a data visualization of all the data that has been created here.
*/

import React, {useEffect, useRef, useState} from 'react'
import FullDbConfigStore from '../../stores/FullDbConfigStore'
import Radium from 'radium'
import {color} from '../CommonStyles'
import VisManager from './VisManager'
import p5 from 'p5'
import DatGui, { DatNumber, DatString, DatBoolean } from "@tim-soft/react-dat-gui";

var sketch = (s) => { 
  let visManager;
  s.setup = () => {
    let canvasContainer = s.select('#canvasContainer');
    let height = canvasContainer.height;
    s.createCanvas(window.innerWidth, height);

    // Vis Manager is the key class that handles all the data management.
    visManager = new VisManager(s);
  };

  s.draw = () => {
    s.background(s.color(0, 0, 0));   
    visManager.draw();
  };

  s.windowResized = () => {
    setTimeout(() => {
      console.log('Canvas Resized.');
      let canvasContainer = s.select('#canvasContainer');
      let height = canvasContainer.height;
      s.resizeCanvas(window.innerWidth, height); 

      visManager.prepareLights();
      visManager.prepareDataPoints();
    }, 500);
  }

  s.updateGuiData = (newData) => {
      const numEntriesData = newData['numEntries'];
      const pointSize = newData['pointSize'];
      const showPoints = newData['showPoints'];
      visManager.setMaxEntries(numEntriesData);
      visManager.setPointSize(pointSize);
      visManager.updateShowPoints(showPoints);
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
    let myP5 = useRef();
    let numEntries = useRef();
    
    // GUI Data
    const [numMaxEntries, setMaxEntries] = useState();
    const [data, setData] = useState({
      title: "Score Visualization",
      numEntries: 50,
      pointSize: 5,
      showPoints: true
    });

    useEffect(() => {
        console.log('New Sketch');
        // Save the value for the ref here. 
        myP5.current = new p5(sketch, sketchRef.current); 

        // Query GUI data to fill maxEntries.
        FullDbConfigStore.getLightConfigs(() => {
          setMaxEntries(FullDbConfigStore.allLightConfigs.length);
        });
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

    // Update GUI data and push it to the p5.js sketch.
    const handleUpdate = (newData) => {
      setData(prevData =>  {
        return {...prevData, ...newData}
      });

      // Pass the new data to the p5.js sketch. 
      myP5.current.updateGuiData(newData);
    }

    let heightStyle = getHeightStyle();
    let containerStyle = [styles.container, heightStyle];
    let canvasStyle = [containerStyle, styles.show];
    return (
        <>
          <DatGui data={data} onUpdate={handleUpdate} style={{'zIndex': 2, position: 'absolute'}}>
              <DatString path="title" label="Supersynthesis" />
              <DatNumber
                ref={numEntries}
                path="numEntries"
                label="Num Entries"
                min={0}
                max={numMaxEntries}
                step={1}
              />
              <DatNumber
                path="pointSize"
                label="Point Size"
                min={1}
                max={10}
                step={0.5}
              />
               <DatBoolean
                path="showPoints"
                label="Show Points"
              />
          </DatGui>
          <div id={'canvasContainer'} ref={sketchRef} style={canvasStyle}></div>
        </>
    );
}

export default Radium(VisCanvas);
