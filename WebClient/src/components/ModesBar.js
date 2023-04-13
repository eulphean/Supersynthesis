/*
  Name: ModesBar.js
  Author: Amay Kataria
  Date: 04/13/2023
  Description: A component to contain the buttons for the modes: Synth, Score, Dream, and Sweep
*/

import React from "react";
import Radium from "radium";
import ModeStore, { MODE } from "../stores/ModeStore";
import { ORIENTATION } from './App';
import {color, fontFamily, fontSize, padding} from './CommonStyles'

const styles = {
    container: {
        position: 'relative',
        backgroundColor: color.bgBlack,
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

    buttonStyle: {
        backgroundColor: color.fgWhite,
        fontFamily: fontFamily.heatwave,
        letterSpacing: '2px',
        padding: padding.verySmall,
        cursor: 'default'
    },

    selectedButton: {
        backgroundColor: color.selected
    }
}

class ModesBar extends React.Component {
    constructor(props) {
        super(props);
        ModeStore.subscribe(this.onModeUpdate.bind(this));
        this.state = {
            currentMode: ModeStore.getCurrentMode()
        }
    }

    render() {
        let heightStyle = this.getHeightStyle();
        let synthButton = this.state.currentMode === MODE.SYNTH ? [styles.buttonStyle, styles.selectedButton] : [styles.buttonStyle];
        let dreamButton = this.state.currentMode === MODE.DREAM ? [styles.buttonStyle, styles.selectedButton] : [styles.buttonStyle];
        let scoreButton = this.state.currentMode === MODE.SCORE ? [styles.buttonStyle, styles.selectedButton] : [styles.buttonStyle];
        let sweepButton = this.state.currentMode === MODE.SWEEP ? [styles.buttonStyle, styles.selectedButton] : [styles.buttonStyle];
        return (
            <div style={[styles.container, heightStyle]}>
                <button onClick={this.handleClick.bind(this, MODE.SYNTH)} style={synthButton}>SYNTH</button>
                <button onClick={this.handleClick.bind(this, MODE.DREAM)} style={dreamButton}>DREAM</button>
                <button onClick={this.handleClick.bind(this, MODE.SCORE)} style={scoreButton}>SCORE</button>
                <button onClick={this.handleClick.bind(this, MODE.SWEEP)} style={sweepButton}>SWEEP</button>
            </div>
        );
    }

    handleClick(newMode) {
        ModeStore.setMode(newMode);
    }

    onModeUpdate(newMode) {
        this.setState({
            currentMode: newMode
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
}

export default Radium(ModesBar);