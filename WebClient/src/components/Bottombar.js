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
import BpmManager from './BpmManager';
import LightManager from './LightManager';
import UserInteractionStore from '../stores/UserInteractionStore';

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
        cursor: 'default'
    },

    button: {
      cursor: 'pointer'
    }
};

class BottomBar extends React.Component {
  constructor(props) {
    super(props); 
    this.state={
      curBpm: '',
      originalBpm: '',
      originalIndex: '',
      isInteracting: false
    }
  }

  componentDidMount() {
    LightConfigStore.subscribeInfo(this.onInfoUpdate.bind(this));
    LightConfigStore.subscribeBpmUpdates(this.onBpmUpdated.bind(this));
    UserInteractionStore.subscribe(this.onInteractionUpdated.bind(this));
  }
 
  render() {
    let bpm = this.state.isInteracting ? this.state.curBpm : this.state.originalBpm;
    let indices = this.state.isInteracting ? this.state.originalIndex + 1 : this.state.originalIndex; 

    let heightStyle = this.getHeightStyle();
    return (
      <div style={[styles.container, heightStyle]}>
          <div style={styles.info}>{'#' + indices}</div>
          <div style={styles.info}>{bpm + 'bpm'}</div>
          <div onClick={this.onSend.bind(this)} style={[styles.info, styles.button]}>Send</div>
      </div>      
    );
  }

  onInteractionUpdated(val) {
    this.setState({
      isInteracting: val
    });
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

  onBpmUpdated(newBpm) {
    this.setState({
      curBpm: newBpm
    });
  }

  onInfoUpdate() {
    console.log('Info updated')
    // Config will always store the source of truth value. 
    // The one at the database. When new data is received, 
    // reset current and original bpm.
    let idx = LightConfigStore.getConfigIndex();
    let oBpm = LightConfigStore.getBpm();
    this.setState({
      originalBpm: oBpm,
      curBpm: oBpm,
      originalIndex: idx
    });
  }

  onSend(event) {
    event.stopPropagation();
    Websocket.commitLightConfigData();
  }
}

export default Radium(BottomBar);