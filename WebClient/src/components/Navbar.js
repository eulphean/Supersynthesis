/*
  Name: BottomBar.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: React component for the top navigation bar on the webpage.
*/
import React from 'react'
import Radium from 'radium'
import Popup from './Popup'
import { ReactComponent as About } from '../svg/about.svg'
import {color, fontFamily, fontSize, padding} from './CommonStyles'

const animation = {
  rotate: Radium.keyframes({
    '0%': {
      transform: 'rotate(0deg)'
    },
    '50%': {
      transform: 'rotate(180deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    }
  }),
}

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: padding.small,
        paddingRight: padding.small,
        zIndex: 1
    },

    title: {
        backgroundColor: color.bgBlack,
        color: color.fbWhite,
        padding: padding.small,
        fontFamily: fontFamily.heatwave,
        fontSize: fontSize.lessBig,
        letterSpacing: '2px'
    },
    
    iconContainer: {
      marginTop: padding.kindaSmall,
    },

    simpleRotation: {
      animation: 'x 30s ease-in-out infinite',
      animationName: animation.rotate
    },
  
    icon: {
        width: '100%',
        height: '100%'
    }
};

class Navbar extends React.Component {
  constructor(props) {
    super(props); 
    this.state={
    }

    this.popupRef = React.createRef(); 
  }

  render() {
    let aboutStyle = [styles.iconContainer, styles.simpleRotation];
    let visibleHeight = window.innerHeight; 
    let heightStyle = {height: visibleHeight * 0.1 + 'px'}; 
    return (
      <div style={styles.block}>
        <Popup ref={this.popupRef}/>
        <div style={[styles.container, heightStyle]}>
          <div style={styles.title}>supersynthesis</div>
          <div style={aboutStyle} onClick={this.handleAbout.bind(this)}>
            <About style={styles.icon} />
          </div>
        </div>
      </div>
    );
  }

  handleAbout() {
    console.log('Create a popup.');
    this.popupRef.current.showPopup();
  }
}

export default Radium(Navbar);
