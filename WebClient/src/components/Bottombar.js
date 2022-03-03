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
import EditModeStore from '../stores/EditModeStore';
import BpmStore from '../stores/BpmStore';
import ConfigIndexStore from '../stores/ConfigIndexStore';

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
        zIndex: '1',
    },

    info: {
        backgroundColor: color.bgBlack,
        padding: padding.verySmall,
        cursor: 'default'
    },

    button: {
      cursor: 'pointer',
      borderStyle: 'solid',
      borderWidth: '1.8px',
      borderColor: color.fgWhite,
      boxShadow:'0px 1px 1px black' 
    }
};

/* offset-x | offset-y | blur-radius | color */
// box-shadow: 10px 5px 5px black;
class BottomBar extends React.Component {
  constructor(props) {
    super(props); 
    this.state={
      localBpm: '',
      dbBpm: '',
      configIndex: '',
      isEditMode: false
    }
  }

  componentDidMount() {
    BpmStore.subscribe(this.onBpmUpdated.bind(this));
    ConfigIndexStore.subscribe(this.onConfigIndexUpdated.bind(this));
    EditModeStore.subscribe(this.onEditModeUpdates.bind(this));
  }
 
  render() {
    let bpm = this.state.isEditMode ? this.state.localBpm : this.state.dbBpm;
    let indices = this.state.isEditMode ? this.state.configIndex + 1 : this.state.configIndex; 
    let heightStyle = this.getHeightStyle();
    let elements = this.state.isEditMode ? 
      this.getEditModeElements(heightStyle, bpm) : 
      this.getElements(heightStyle, indices, bpm);
    return elements; 
  }

  getEditModeElements(heightStyle, bpm) {
    return (
      <div style={[styles.container, heightStyle]}>
          <div onClick={this.onBack.bind(this)} style={[styles.info, styles.button]}>Back</div>
          <div style={styles.info}>{bpm + 'bpm'}</div>
          <div onClick={this.onSend.bind(this)} style={[styles.info, styles.button]}>Send</div>
      </div>   
    );
  }

  getElements(heightStyle, indices, bpm) {
    return (
      <div style={[styles.container, heightStyle]}>
        <div style={styles.info}>{'#' + indices}</div>
        <div style={styles.info}>{bpm + 'bpm'}</div>
        <div onClick={this.onEdit.bind(this)} style={[styles.info, styles.button]}>Edit</div>
      </div>  
    );
  }

  onEditModeUpdates() {
    let isEditMode = EditModeStore.isEditMode; 
    // Don't re-render if we are already in the state. 
    if (this.state.isEditMode !== isEditMode) {
      this.setState({
        isEditMode: isEditMode
      });
    }
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

  onBpmUpdated() {
    let dbBpm = BpmStore.getDbBpm();
    let localBpm = BpmStore.getLocalBpm();

    // Update DB bpm.
    if (dbBpm !== this.state.dbBpm) {
      this.setState({
        dbBpm: dbBpm
      });
    }

    // Update local bpm. 
    if (localBpm !== this.state.localBpm) {
      this.setState({
        localBpm: localBpm
      });
    }
  }

  onConfigIndexUpdated() {
    let newConfigIndex = ConfigIndexStore.getConfigIndex();
    if (newConfigIndex !== this.state.configIndex) {
      this.setState({
        configIndex: newConfigIndex
      });
    }
  }

  onSend(event) {
    event.stopPropagation();
    EditModeStore.setEditMode(false);
    EditModeStore.setUserInteracting(false);
    // Just before committing this. 
    Websocket.commitLightConfigData();
  }

  onBack(event) {
    event.stopPropagation();
    EditModeStore.setEditMode(false);
    EditModeStore.setUserInteracting(false);
    this.setState({
      isEditMode: false
    });
  }

  onEdit(event) {
    event.stopPropagation();
    EditModeStore.setEditMode(true);
    this.setState({
      isEditMode: true
    });
  }
}

export default Radium(BottomBar);


// onInfoUpdate() {
//   console.log('Info updated')
//   // Config will always store the source of truth value. 
//   // The one at the database. When new data is received, 
//   // reset current and original bpm.
//   let idx = LightConfigStore.getConfigIndex();
//   let oBpm = LightConfigStore.getBpm();
//   this.setState({
//     originalBpm: oBpm,
//     originalIndex: idx
//   });

//   // Don't do double updates. This saved on Sending the date.
//   if (oBpm !== this.state.curBpm) {
//     this.setState({
//       curBpm: oBpm
//     });
//   }
// }
