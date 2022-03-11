/*
  Name: App.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: Entry point component for the application. 
*/

import React from 'react'
import Radium from 'radium'

import Navbar from './Navbar';
import WaveCanvas from './WaveCanvas';
import BottomBar from './Bottombar';

// Enum to track the device orientation. 
export const ORIENTATION = {
  PORTRAIT: 0,
  LANDSCAPE: 1
}

const styles = {
  container: {
    position: 'fixed',
    webkitOverflowScrolling: 'auto',
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
  }

  render() {
    return (
      <div style={styles.container}>
        <Navbar orientation={this.state.orientation} />
        <WaveCanvas orientation={this.state.orientation} />
        <BottomBar orientation={this.state.orientation} />
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