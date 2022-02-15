import React from 'react'
import Radium from 'radium'
import Websocket from './Websocket'

const styles = {
  container: {
    position: 'fixed',
    top: '0px',
    bottom: '0px',
    left: '0px',
    right: '0px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'black',
    color: 'white'
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
        <button onClick={this.onClick.bind(this)} 
          style={styles.button}>Press Me</button>
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