/*
  Name: App.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: Entry point component for the application. 
*/


import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Radium from 'radium'

import Navbar from './Navbar';
import WaveCanvas from './WaveCanvas';
import BottomBar from './Bottombar';
import ModesBar from './ModesBar';
import VisCanvas from './Visualization/VisCanvas';

// Enum to track the device orientation. 
export const ORIENTATION = {
  PORTRAIT: 0,
  LANDSCAPE: 1
}

const styles = {
  container: {
    position: 'fixed',
    WebkitOverflowScrolling: 'touch',
    top: '0%',
    left: '0%',
    right: '0%',
    bottom: '0%',
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    height: '100%',
    width: '100%',
    zIndex: '1'
  },

  button: {
    width: '100px',
    height: '50px',
    backgroundColor: 'white',
    color: 'black'
  }
};

class App extends React.Component {
  constructor(props) {
    super(props); 
    window.addEventListener('resize', this.handleResize.bind(this));
    this.state = {
      orientation: ORIENTATION.PORTRAIT
    };     
  }

  componentDidMount() {
    this.evaluateOrientation();
    document.addEventListener('gesturestart', function(e) {
      e.preventDefault();
      // special hack to prevent zoom-to-tabs gesture in safari
      document.body.style.zoom = 0.99;
    });
  
    document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
        // special hack to prevent zoom-to-tabs gesture in safari
        document.body.style.zoom = 0.99;
    });
  
    document.addEventListener('gestureend', function(e) {
      e.preventDefault();
      // special hack to prevent zoom-to-tabs gesture in safari
      document.body.style.zoom = 0.99;
    });
  }

  render() {
    return (
      <div style={styles.container}>
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={
              <>
                <Navbar orientation={this.state.orientation} />
                <WaveCanvas orientation={this.state.orientation} />
                <ModesBar orientation={this.state.orientation} />
                <BottomBar orientation={this.state.orientation} />  
              </>
            }
          />
          <Route path="/vis" element={
              <>
                <VisCanvas orientation={this.state.orientation}/>
              </>
          } 
          />
        </Routes>
      </Router>
      </div>

    );
  }

  handleResize() {
    // Resize triggered - evaluate orientation and render
    // the components again be it. 
    this.evaluateOrientation();
  }

  evaluateOrientation() {
    let t = (window.innerHeight < window.innerWidth); 
    if (t) {
      console.log('App: Landscape');
      this.setState({
        orientation: ORIENTATION.LANDSCAPE
      });
    } else {
      console.log('App: Portrait');
      this.setState({
          orientation: ORIENTATION.PORTRAIT
      });
    }
  }
}

export default Radium(App);