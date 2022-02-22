/*
  Name: BottomBar.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: React component for the bottom bar on the page. This has the send button. 
*/
import React from 'react'
import Radium from 'radium'
import { ORIENTATION } from './App';
import {color, fontFamily, fontSize, padding} from './CommonStyles'
import Websocket from './Websocket';
import LightConfigStore from '../stores/LightConfigStore';

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: padding.small,
        paddingRight: padding.small,
        // // // Common Styles
        color: color.fbWhite,
        fontFamily: fontFamily.josefin,
        fontSize: fontSize.lessBig,
        letterSpacing: '2px',
        zIndex: 1,
    },

    info: {
        backgroundColor: color.bgBlack,
        padding: padding.verySmall,
    }
};

class BottomBar extends React.Component {
  constructor(props) {
    super(props); 
    this.state={
      bpm: '',
      index: ''
    }
    LightConfigStore.subscribeInfo(this.onInfoUpdate.bind(this));
  }
 
  render() {
    let bpm = this.state.bpm + 'bpm'
    let states = '#' + this.state.index; 

    let heightStyle = this.getHeightStyle();
    return (
      <div style={[styles.container, heightStyle]}>
          <div style={styles.info}>{states}</div>
          <div style={styles.info}>{bpm}</div>
          <div onClick={this.onSend.bind(this)} style={styles.info}>Send</div>
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
        c = 0.09; 
      }
    }

    return deviceHeight * c; 
  }

  onInfoUpdate() {
    let idx = LightConfigStore.getConfigIndex();
    let bpm = LightConfigStore.getBpm(); 
    this.setState({
      index: idx + 1, 
      bpm: bpm
    });
  }

  onSend(event) {
    event.stopPropagation();
    Websocket.commitLightConfigData();
  }
}

export default Radium(BottomBar);