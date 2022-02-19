/*
  Name: App.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: Entry point component for the application. 
*/

import React from 'react'
import Radium from 'radium'
import Websocket from './Websocket'

import Navbar from './Navbar';
import WaveCanvas from './WaveCanvas';
import Bottombar from './Bottombar';

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    height: '100vh'
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
      isLandscape: this.isLandscape(),
      isPortrait: this.isPortrait()
    }; 
  }

  render() {
    return (
      <div style={styles.container}>
        <Navbar />
        <WaveCanvas />
        <Bottombar />
      </div>
    );
  }

  onClick(event) {
    event.stopPropagation();
    Websocket.saveEntry();
    // Fire some data for the websocket. 
  }

  handleResize() {
    console.log('Resize triggered');
    this.setState({
      isLandscape: this.isLandscape(),
      isPortrait: this.isPortrait()
    });
  }

  isLandscape() {
      let t = (window.innerHeight < window.innerWidth); 
      if (t) {
        console.log('App: Landscape'); 
      }

      return t; 
  }

  isPortrait() {
    let t = (window.innerHeight > window.innerWidth);
    if (t) {
      console.log('App: Portrait'); 
    }

    return t; 
  }
}

export default Radium(App);