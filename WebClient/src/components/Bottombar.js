/*
  Name: BottomBar.js
  Author: Amay Kataria
  Date: 02/19/2022
  Description: React component for the bottom bar on the page. This has the send button. 
*/
import React from 'react'
import Radium from 'radium'
import {color, fontFamily, fontSize, padding} from './CommonStyles'

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
    },

    button: {
        backgroundColor: color.bgBlack,
        padding: padding.verySmall,
    }
};

class Navbar extends React.Component {
  constructor(props) {
    super(props); 
    this.state={

    }
  }
 
  render() {
    return (
        <div style={styles.container}>
            <div style={styles.info}>51 states</div>
            <div style={styles.info}>54bpm</div>
            <div style={styles.button}>send</div>
        </div>      
    );
  }
}

export default Radium(Navbar);