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
import BottomBar from './BottomBar';

// Enum to track the device orientation. 
export const ORIENTATION = {
  PORTRAIT: 0,
  LANDSCAPE: 1
}

const styles = {
  container: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    right: '0px',
    bottom: '0px',
    overflow: 'hidden',
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
      setTimeout(() => {
        console.log('App: Landscape');
        this.setState({
          orientation: ORIENTATION.LANDSCAPE
        }); 
      }, 500);
    } else {
      setTimeout(() => {
        console.log('App: Portrait');
        this.setState({
          orientation: ORIENTATION.PORTRAIT
        });
      }, 500);
    }
  }
}

export default Radium(App);