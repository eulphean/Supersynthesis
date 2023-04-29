/*
  Name: Synth.js
  Author: Amay Kataria
  Date: 04/12/2023
  Description: A new component that allows one to control the installation as a synthesizer.
*/

import React from 'react'
import Radium from 'radium'
import SynthStore from '../stores/SynthStore';
import Websocket from './Websocket';

const ON_COLOR = 'rgb(255, 255, 255)';
const OFF_COLOR = 'rgba(255, 255, 255, 0.3)';

const styles = {
    container: {
        backgroundColor: 'black',
        fontColor: 'white'
    },
    buttonStyle: {
        position: 'absolute',
        height: '100%',
        width: '20px'
    }
}

const NUM_LIGHTS = 24; 

class Synth extends React.Component {
    constructor(props) {
        super(props);
        this.lightButtons = [];
        SynthStore.subscribe(this.onSynthNotes.bind(this));
        this.state = {
            keyState: Array(24).fill(0)
        }
    }

    render() {
        let buttons = this.getButtons();
        return (
            <div style={this.props.wrapperStyle}>
                {buttons}
            </div>
        );
    }

    getButtons() {
        let lightButtons = [];
        let lightIncrement = window.innerWidth / NUM_LIGHTS;
        // Create a set of buttons that borrow from the keyboard
        let lightWidth = lightIncrement / 2;
        for (let i = 0; i < NUM_LIGHTS; i++) {
            let xPos = i * lightIncrement; 
            let buttonStyle = this.getButtonStyle(i, xPos, lightWidth);
            // Create a new light instance. 
            let button = (
                <div 
                    style={buttonStyle} 
                    key={i}
                    onMouseDown={this.onPress.bind(this, i)}
                    onMouseUp={this.onRelease.bind(this, i)}
                    onMouseLeave={this.onRelease.bind(this, i)}
                >
                </div>
            )
            lightButtons.push(button);
        }
        return lightButtons;
    }

    getButtonStyle(idx, xPos, lightWidth) {
        // We do this when we are making our lights (check Light.js), so I repeated
        // that here as well. Just to keep consistency between how the light is laid out.
        let lightPos = xPos + lightWidth/2;
        
        // Make the light style.
        let style = {...styles.buttonStyle}; // Clone the style and then modify it
        style.width = lightWidth + 'px';
        style.left = lightPos + 'px';
        if (this.state.keyState[idx] === 1) {
            style.backgroundColor = ON_COLOR;
        } else {
            style.backgroundColor = OFF_COLOR;
        }
        return style;
    }

    // Index ranges from 0-23 for each light.
    onPress(index) {
        this.updateState(this.state.keyState, index, 1);
    }

    onRelease(index) {
        this.updateState(this.state.keyState, index, 0);
    }

    // Common helper function to update the piano roll state.
    updateState(oldState, index, value)  {
        let newKeyState = [...oldState]; 
        newKeyState[index] = value; 
        let newStateString = JSON.stringify(newKeyState);
        let oldStateString = JSON.stringify(oldState);

        if (newStateString !== oldStateString) {
            // Send this config over to the installation.
            Websocket.sendSynthNotes(newStateString);
        }  

        this.setState({
            keyState: newKeyState
        });
    }

    onSynthNotes(newSynthNotes) {
        let newSynthString = JSON.stringify(newSynthNotes);
        let oldStateString = JSON.stringify(this.state.keyState);
        if (newSynthString !== oldStateString) {
            this.setState({
                keyState: newSynthNotes
            });
        }
    }
}

export default Radium(Synth);