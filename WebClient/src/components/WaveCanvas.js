import React from 'react'
import Radium from 'radium'
import p5 from 'p5'
import {color} from './CommonStyles'

var sketch = (s) => {
  s.setup = () => {
    let canvasContainer = s.select('#canvasContainer');
    let height = canvasContainer.height;
    s.createCanvas(window.innerWidth, height);
  };

  s.draw = () => {
      s.background('green');
      s.fill('white');
      s.circle(s.width/2, s.height/2, 50);
  };

  // s.windowResized = () => {
  //   let height = 0.95 * window.innerHeight;
  //   s.resizeCanvas(window.innerWidth, height); 
  // }
};

const styles = {
  // TODO: Is this height logic going to scale?
  container: {
    backgroundColor: color.bgBlack,
    height: '82vh',
    margin: 0,
    padding: 0
  }
};

class WaveCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state={

    };

    this.containerRef = React.createRef();
    this.sketchRef = React.createRef(); 
  }

  componentDidMount() {
    console.log('Wave canvas mounted');    
    this.myP5 = new p5(sketch, this.sketchRef.current);
  }

  
  render() {
    return (
      <div id={'canvasContainer'} 
        ref={this.sketchRef} 
        style={styles.container}>
      </div>
    );
  }
}

export default Radium(WaveCanvas);