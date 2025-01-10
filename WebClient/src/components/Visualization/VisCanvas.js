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
import DatGui, { DatNumber, DatFolder, DatString, DatBoolean, DatSelect, DatColor } from "@tim-soft/react-dat-gui";

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
    visManager.guiUpdates(newData);
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
    const gui = useRef();
    
    // GUI Data
    const [numMaxEntries, setMaxEntries] = useState();
    const [data, setData] = useState({
      title: "Score Visualization",
      numEntries: 50,
      pointSize: 5,
      showPoints: true,
      pointShape: 'circle',
      rotation: false,
      rotateSpeed: 0.1, 
      showInactive: true,
      colorActive: "#FFFFFF",
      colorInactive: '#000000',
      showActive: true,
      showLights: true,
      hideGui: false
    });

    const [hideGui, setHideGui] = useState(false);  

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
      setHideGui(newData.hideGui);
      
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
         {hideGui ? 
            <></> :
            <DatGui ref={gui} data={data} onUpdate={handleUpdate} style={{'zIndex': 2, position: 'absolute'}}>
              <DatString path="title" label="Supersynthesis" />
              <DatFolder title="Data Visualization" closed={false}>
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
                  max={20}
                  step={0.5}
                />
                <DatBoolean
                  path="showPoints"
                  label="Show Points"
                />
                <DatSelect
                  label="Point Shape"
                  path="pointShape"
                  options={["circle", "rectangle", "triangle", "arc"]}
                />
                <DatBoolean
                  path="rotate"
                  label="Rotate"
                />
                <DatNumber
                  path="rotateSpeed"
                  label="Rotate Speed"
                  min={0.01}
                  max={0.5}
                  step={0.01}
                />
                <DatBoolean
                  path="showInactive"
                  label="Show Inactive"
                />
                <DatColor label="Color" path="colorInactive" />
                <DatBoolean
                  path="showActive"
                  label="Show Active"
                />
                <DatColor label="Color" path="colorActive" />
                <DatBoolean
                  path="showLights"
                  label="Show Lights"
                />
              </DatFolder>
              <DatBoolean
                  path="hideGui"
                  label="Hide Gui"
              />
            </DatGui>
        }
          
        <div id={'canvasContainer'} ref={sketchRef} style={canvasStyle}></div>
        </>
    );
}

export default Radium(VisCanvas);
