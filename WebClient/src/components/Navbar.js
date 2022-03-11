/*
  Name: BottomBar.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: React component for the top navigation bar on the webpage.
*/
import React from 'react'
import Radium from 'radium'
import { PopupType } from './Popup'
import Popup from './Popup'
import { ORIENTATION } from './App'
import { ReactComponent as About } from '../svg/about.svg'
import {color, fontFamily, fontSize, padding} from './CommonStyles'
import EditModeStore from '../stores/EditModeStore'
import TimerStore from '../stores/TimerStore'

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
        zIndex: '1'
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
      display: 'flex',
      justifyContent: 'center',
      width: fontSize.huge,
      height: fontSize.huge,
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

  componentDidMount() {
    TimerStore.subscribePopup(this.onShowPopup.bind(this)); 
    TimerStore.subscribeReset(this.onReset.bind(this));
  }

  onShowPopup() 
  {
    // Send popup type. 
    this.popupRef.current.showPopup(PopupType.Send);
    console.log('Show Poppup');
  }

  onReset() {
    EditModeStore.setEditMode(false);
    EditModeStore.setUserInteracting(false);
    this.popupRef.current.hidePopup();
  }

  render() {
    let aboutStyle = [styles.iconContainer, styles.simpleRotation];
    let heightStyle = this.getHeightStyle(); 
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

  getHeightStyle() {
    let height = this.getHeight();
    let heightStyle = {
      height: height + 'px'
    };
    return heightStyle; 
  }

  getHeight() {
    let deviceHeight = window.innerHeight;
    let deviceWidth = window.innerWidth; 
    let c = 0; 
    if (this.props.orientation === ORIENTATION.PORTRAIT) {
      if (deviceHeight < 900) {
        c = 0.1
      }

      if (deviceHeight > 900 && deviceHeight < 1000) {
        c = 0.075
      }

      if (deviceHeight > 1000) {
        c = 0.06
      }
    }

    if (this.props.orientation === ORIENTATION.LANDSCAPE) {
      if (deviceWidth < 1000) {
        c = 0.15; 
      }      

      if (deviceWidth > 1000) {
        c = 0.09
      }
    }

    return deviceHeight * c; 
  }

  handleAbout() {
    this.popupRef.current.showPopup(PopupType.About);
  }
}

export default Radium(Navbar);
