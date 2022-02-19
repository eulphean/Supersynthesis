import React from 'react'
import Radium from 'radium'
import { ReactComponent as About } from '../svg/about.svg'
import {color, fontFamily, fontSize, padding} from './CommonStyles'

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '10vh',
        paddingLeft: padding.small,
        paddingRight: padding.small,
    },

    title: {
        backgroundColor: color.bgBlack,
        color: color.fbWhite,
        padding: padding.small,
        fontFamily: fontFamily.airwaves,
        fontSize: fontSize.veryBig,
        letterSpacing: '2px'
    },
    
    iconContainer: {
      marginTop: padding.kindaSmall
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
  }

  render() {
    return (
      <div style={styles.block}>
        <div style={styles.container}>
          <div style={styles.title}>supersynthesis</div>
          <div style={styles.iconContainer}>
            <About style={styles.icon} />
          </div>
        </div>
      </div>
    );
  }
}

export default Radium(Navbar);
