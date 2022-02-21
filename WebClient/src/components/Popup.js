/*
  Name: Popup.js
  Author: Amay Kataria
  Date: 02/21/2022
  Description: Popup component that is shown to display the about information. 
*/

import React from 'react'
import Radium from 'radium'
import { color, padding, fontFamily, fontSize } from './CommonStyles.js'
import { ReactComponent as Exit } from '../svg/close.svg'
import { fadeOutUp, fadeOutDown, fadeInDown, fadeInUp } from 'react-animations'

// Maintain the current popup state (to track animations)
var PopupState = {
    Open: 0,
    Close: 1,
    None: 2
}; 

// Custom Fade in animation. 
const customFadeIn = Radium.keyframes({
    from: {
        opacity: '0'
    },
    to: {
        opacity: '0.5'
    }
}, 'fadesIn'); 

const customFadeOut = Radium.keyframes({
    from: {
        opacity: '0.5'
    },
    to: {
        opacity: '0'
    }
}, 'fadesOut'); 

const fadeInDuration = '0.5s'; 
const slideInDuration = '2.0s'; 
const fadeOutDuration = '1.5s';

const styles={
    overlay: {
        position: 'fixed',
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px',
        background: color.fgWhite,
        zIndex: '999'
    },

    fadeIn: {
        animationName: customFadeIn,
        animationDuration: fadeInDuration,
        animationFillMode: 'forwards',
        animationTimingFunction:'ease-in'
    },
    
    fadeOut: {
        animationName: customFadeOut,
        animationDuration: fadeOutDuration,
        animationFillMode: 'forwards',
        animationTimingFunction: 'ease-out'
    },

    fadeOutUp: {
        animationName: Radium.keyframes(fadeOutUp, 'fadeOutUp'),
        animationDuration: fadeOutDuration,
        animationFillMode: 'forwards',
        animationTimingFunction: 'ease-out'
    },

    fadeOutDown: {
        animationName: Radium.keyframes(fadeOutDown, 'fadeOutDown'),
        animationDuration: fadeOutDuration,
        animationFillMode: 'forwards',
        animationTimingFunction: 'ease-out'
    },

    fadeInDown: {
        animationName: Radium.keyframes(fadeInDown, 'fadeInDown'),
        animationDuration: slideInDuration,
        animationFillMode: 'forwards',
        animationTimingFunction: 'ease-in'
    },

    fadeInUp: {
        animationName: Radium.keyframes(fadeInUp, 'fadeInUp'),
        animationDuration: slideInDuration,
        animationFillMode: 'forwards',
        animationTimingFunction: 'ease-in'
    },

    showOverlay: {
        zIndex: '998',
        opacity: '1'
    },

    hideOverlay: {
        zIndex: '-998',
        opacity: '0'
    },

    showContent: {
        zIndex: '999',
        opacity: '1'
    },

    hideContent: {
        zIndex: '-999',
        opacity: '0'
    },

    contentContainer: {
        position: 'fixed',
        zIndex: '-999',
        left: '0px',
        top:'0px',
        bottom: '0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },

    content: {
        borderRadius: fontSize.tiny,
        overflow: 'auto',
        maxWidth: 'calc(100% - 50px)', // Bind this to media query
        maxHeight: 'calc(100% - 100px)', // Bind this to media query
        
        '@media (min-width: 600px)': {      
            maxWidth: 'calc(100% - 100px)', // Bind this to media query
            maxHeight: 'calc(100% - 100px)', // Bind this to media query
        },

        '@media (min-width: 750px)': {  
            maxWidth: 'calc(100% - 150px)', // Bind this to media query
            maxHeight: 'calc(100% - 100px)', // Bind this to media query
        },

        '@media (min-width: 1200px)' : {
            maxWidth: 'calc(100% - 300px)', // Bind this to media query
            maxHeight: 'calc(100% - 100px)', // Bind this to media query
        }
    },

    stretchContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: color.bgBlack,
        color: color.fgWhite,
        paddingLeft: padding.small, // Bind this to media query
        paddingRight: padding.small, // Bind this to media query,

        '@media (min-width: 600px)': {      
            paddingLeft: padding.extraHuge, 
            paddingRight: padding.extraHuge
        },

        '@media (min-width: 900px)': {  
            paddingLeft: padding.veryMassive, 
            paddingRight: padding.veryMassive
        },

        '@media (min-width: 1200px)' : {
            paddingLeft: padding.extraMassive, 
            paddingRight: padding.extraMassive
        },
        opacity: '0.8'
    },

    title: {
        marginTop: padding.big,
        textAlign: 'center',
        // fontFamily: fontFamily.elliott,
        fontSize: fontSize.veryBig,
        letterSpacing: '2.5px',
        lineHeight: '1.8',
       
        '@media (min-width: 750px)': {  
            fontSize: fontSize.extraBig
        },

        '@media (min-width: 900px)': {  
            fontSize: fontSize.huge
        },

        '@media (min-width: 1200px)' : {
            fontSize: fontSize.veryHuge
        }
    },

    body: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: padding.small,
        justifyContent: 'center',
        // fontFamily: fontFamily.grotesk,
        fontSize: fontSize.small,
        color: color.fgWhite
    },

    // Applied on stuff
    mediaQueryOnText: {
        '@media (min-width: 750px)': {  
            fontSize: fontSize.big
        },

        '@media (min-width: 900px)': {  
            fontSize: fontSize.veryBig
        }
    },

    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginRight: '-' + fontSize.verySmall,
        height: fontSize.big,
        width: fontSize.big,
        fill: color.fgWhite,

        '@media (min-width: 600px)': {  
            marginRight: '-' + fontSize.extraInsane,
            height: fontSize.veryBig, 
            width: fontSize.veryBig
        },

        '@media (min-width: 900px)': {  
            height: fontSize.extraBig, 
            width: fontSize.extraBig,
            marginRight: '-108px'
        },

        '@media (min-width: 1200px)': {  
            marginRight: '-124px'
        }
    },

    icon: { 
        width: '100%',
        height: '100%'
    },

    footerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: padding.big,
    },

    footer: {
        display: 'flex',
        alignItems: 'center',
        color: color.fgWhite,
        // fontFamily: fontFamily.grotesk,
        fontSize: fontSize.verySmall,
        letterSpacing: '2.0px',

        '@media (min-width: 750px)': {  
            fontSize: fontSize.small,
        }
    },
    
    footerFirst: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

    footerSecond: {
        marginTop: padding.tiny,
    },

    developed: {
        fontSize: fontSize.verySmall,
        // fontFamily: fontFamily.grotesk,
        paddingLeft: padding.tiny, 
        paddingRight: padding.tiny,
        color: color.fgWhite,

        '@media (min-width: 750px)': {  
            fontSize: fontSize.small,
        }
    },

    developer: {
        marginLeft: padding.tiny
    },

    footerSpace: {
        marginBottom: padding.extraBig
    }
}

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            isVisible: false,
            popupState: PopupState.None,
        };

        this.content = React.createRef(); 
    }

    render() {
        // Handle overlay styles. 
        let overlayStyle; 
        if (this.state.isVisible) {
            overlayStyle = [styles.overlay, styles.showOverlay]; 
            if (this.state.popupState === PopupState.Open) {
                overlayStyle = [overlayStyle, styles.fadeIn]; 
            } else if (this.state.popupState === PopupState.Close) {
                overlayStyle = [overlayStyle, styles.fadeOut]; 
            } else {
                // Do nothing. 
            }
        } else {
            overlayStyle = [styles.overlay, styles.hideOverlay]; 
        }

        // Handle different types of Popups. 
        let content, contentContainerStyle; 
        content = this.getAboutContent();
        if (this.state.isVisible) {
            contentContainerStyle = [styles.contentContainer, styles.showContent]; 
            if (this.state.popupState === PopupState.Open) {
                contentContainerStyle = [contentContainerStyle, styles.fadeInDown]; 
            } else if (this.state.popupState === PopupState.Close) {
                contentContainerStyle = [contentContainerStyle, styles.fadeOutUp];
            } else {
                // Do nothing when it's in None state. 
            }
        } else {
            contentContainerStyle = [styles.contentContainer, styles.hideContent]; 
        }

        return (
            <div onClick={this.handleOnTouch.bind(this)} onTouchStart={this.handleOnTouch.bind(this)} >
                <div style={overlayStyle}></div>
                <div onAnimationEnd={this.contentAnimationEnd.bind(this)} style={contentContainerStyle}>
                    {content}
                </div>
            </div>
        );
    }

    contentAnimationEnd() {
        if (this.state.isVisible) {
            // Hide everything when content animation ends. 
            if (this.state.popupState === PopupState.Close) {
                this.setState({
                    isVisible: false,
                    popupState: PopupState.None
                }); 
            }
        }
    }

    getIconButton() {
        return(
            <div onClick={this.hidePopup.bind(this)} style={styles.iconContainer}>
                <Exit style={styles.icon} />
            </div>
        ); 
    }

    getAboutContent() {
        let footer = this.getFooter(); 
        let iconButton = this.getIconButton();  
        let bodyStyle = [styles.body, styles.mediaQueryOnText];
        return (
            <div ref={this.content} style={styles.content}>
                <div style={styles.stretchContainer}>
                    { iconButton }
                    <div style={bodyStyle}>
                        Hi I am some text - I will be the info.
                        I will be the boody.
                    </div>
                    { footer }
                </div>
            </div>
        )
    }

    getFooter() {
        const jen = 'https://jennifertrainadorge.com/';
        const amay = 'https://amaykataria.com';
        return (
            <div style={styles.footerContainer}>
                <div style={styles.footerFirst}>
                    <span style={styles.developed}>©&nbsp;</span>
                    <a 
                        style={styles.footer} 
                        target='_blank' 
                        rel="noopener noreferrer" 
                        href={jen}>
                        Jennifer Traina-Dorge
                    </a>
                    <span style={styles.developed}>&nbsp;2020</span>
                </div>
                <div style={[styles.footer, styles.footerSecond]}>
                    <span style={styles.developed}>Developed by </span>
                    <a 
                        style={styles.developer} 
                        target='_blank' 
                        rel="noopener noreferrer" 
                        href={amay}>
                        Amay Kataria
                    </a>
                </div>
            </div>
        )
    }

    showPopup() {
        // Adjust the scroll top.
        this.content.current.scrollTop = 0; 

        this.setState({
            isVisible: true,
            popupState: PopupState.Open,
        }); 
    }

    hidePopup(event) {
        event.stopPropagation(); 

        this.setState({
            popupState: PopupState.Close
        });
    }

    handleOnTouch(event) {
        // Don't let this propogate to the main screen
        // where touch events mean something. 
        event.stopPropagation();
    }
 }

export default Radium(Popup);

