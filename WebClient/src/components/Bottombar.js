/*
  Name: BottomBar.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: React component for the bottom bar on the page. This has the send button. 
*/
import React from 'react'
import Radium from 'radium'
import {color, fontFamily, fontSize, padding} from './CommonStyles'
import Websocket from './Websocket';
import LightConfigStore from '../stores/LightConfigStore';

const styles = {
    container: {
        position: 'absolute',
        height: '8vh',
        left: '0',
        right: '0',
        bottom: '0',
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
        letterSpacing: '2px'
    },

    info: {
        backgroundColor: color.bgBlack,
        padding: padding.verySmall,
    }
};

class Navbar extends React.Component {
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
    return (
        <div style={styles.container}>
            <div style={styles.info}>{states}</div>
            <div style={styles.info}>{bpm}</div>
            <div onClick={this.onSend.bind(this)} style={styles.info}>Send</div>
        </div>      
    );
  }

  onInfoUpdate() {
    let idx = LightConfigStore.getConfigIndex();
    let bpm = LightConfigStore.getBpm(); 
    this.setState({
      index: idx, 
      bpm: bpm
    });
  }

  onSend(event) {
    event.stopPropagation();
    Websocket.commitLightConfigData();
  }
}

export default Radium(Navbar);