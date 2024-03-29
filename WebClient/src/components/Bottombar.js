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
import EditModeStore from '../stores/EditModeStore';
import BpmStore from '../stores/BpmStore';
import ConfigIndexStore from '../stores/ConfigIndexStore';
import LightConfigStore from '../stores/LightConfigStore';
import TimerStore from '../stores/TimerStore';
import ModeStore, {MODE} from '../stores/ModeStore'

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
        fontFamily: fontFamily.heatwave,
        letterSpacing: '2px',
        padding: padding.verySmall,
        cursor: 'default'
    },

    button: {
      cursor: 'pointer',
      borderStyle: 'solid',
      borderWidth: '1.8px',
      borderColor: color.fgWhite,
      boxShadow:'0px 1px 1px black' 
    },

    disabled: {
      backgroundColor: color.disabled
    }
};

class BottomBar extends React.Component {
  constructor(props) {
    super(props); 
    this.state={
      localBpm: '',
      dbBpm: '',
      configIndex: '',
      isEditMode: false,
      isSendEnabled: LightConfigStore.hasConfigEdited,
      currentMode: ModeStore.getCurrentMode()
    }
  }

  componentDidMount() {
    BpmStore.subscribe(this.onBpmUpdated.bind(this));
    ConfigIndexStore.subscribe(this.onConfigIndexUpdated.bind(this));
    EditModeStore.subscribe(this.onEditModeUpdate.bind(this));
    LightConfigStore.subscribeForConfigChange(this.onLightConfigChange.bind(this));
    ModeStore.subscribe(this.onModeUpdate.bind(this));
  }
 
  render() {
    let bpm = this.state.isEditMode ? this.state.localBpm : this.state.dbBpm;
    let indices = this.state.configIndex; 
    let heightStyle = this.getHeightStyle();
    let elements = this.getElements(heightStyle, indices, bpm);
    return elements; 
  }

  getElements(heightStyle, indices, bpm) {
    let leftItem = this.getLeftItem(indices); 
    let sendButton = this.getSendButton();
    let bpmNum = (this.state.currentMode === MODE.SYNTH || this.state.currentMode === MODE.SWEEP) ? '' : bpm;
    return (
      <div style={[styles.container, heightStyle]}>
        { leftItem }
        {<div style={styles.info}>{bpmNum + 'bpm'}</div>}
        { sendButton }
      </div>  
    );
  }

  getLeftItem(indices) {
    let item = '';
    if (this.state.currentMode === MODE.SYNTH || this.state.currentMode === MODE.SWEEP) {
      item = (<div style={styles.info}>{0}</div>);
    } else {
      item = this.state.isEditMode ? 
        <div
          onClick={this.onBack.bind(this)}
          style={[styles.info, styles.button]}
          >BACK
          </div> : 
        (<div style={styles.info}>{indices}</div>);
    }

    return item; 
  }

  getSendButton() {
    let buttonStyle = [styles.info, styles.button];
    buttonStyle = !this.state.isSendEnabled ? [buttonStyle, styles.disabled] : buttonStyle;
    let onClick = !this.state.isSendEnabled ? () => {} : this.onSend.bind(this);
    return (
      <div 
        onClick={onClick} 
        style={buttonStyle}
      >SEND
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
        c = 0.065; 
      }
    }

    return deviceHeight * c; 
  }

  onLightConfigChange() {
    let hasConfigChanged = LightConfigStore.hasConfigEdited; 
    this.setState({
      isSendEnabled: hasConfigChanged
    });
  }

  onEditModeUpdate() {
    let isEditMode = EditModeStore.isEditMode; 
    // Don't re-render if we are already in the state. 
    if (this.state.isEditMode !== isEditMode) {
      this.setState({
        isEditMode: isEditMode        
      });
    }
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
    TimerStore.cancelPopup();
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

  onModeUpdate(newMode) {
    this.setState({
      currentMode: newMode
    });
  }
}

export default Radium(BottomBar);