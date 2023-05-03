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
import EditModeStore from '../stores/EditModeStore.js'
import Websocket from './Websocket.js'
import TimerStore from '../stores/TimerStore.js'

// Maintain the current popup state (to track animations)
var PopupState = {
    Open: 0,
    Close: 1,
    None: 2
}; 

export var PopupType = {
    About: 0,
    Send: 1,
    Score: 2
}

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
const slideInDuration = '1.0s'; 
const fadeOutDuration = '0.5s';

const aboutTheWork = 'Supersynthesis is an interactive audio-visual art installation that invites people to create a space for collective expression and participation. Accompanied with a physical installation, it utilizes the medium of light and sound to craft a communal experience where the audience activates the piece and the space around it by interacting with it through an online interface. Every audience input is blended into the previous response, thus synthesizing a progressively evolving wave of expression. In an increasingly fragmented society, this project aspires to create an inclusive space, where anybody can leave a trace of their thought with freedom. By participating in Supersynthesis, one becomes part of a communal wave that’ll anonymously accumulate until the forthcoming eternity.';
const styles={
    overlay: {
        position: 'fixed',
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px',
        background: color.bgBlack,
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
        opacity: '1.0',
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: color.fgWhite
    },

    title: {
        marginTop: padding.lessSmall,
        marginBottom: padding.small,
        textAlign: 'center',
        fontFamily: fontFamily.heatwave,
        fontSize: fontSize.extraBig,
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

    sendTitle: {
        marginTop: padding.small,
        textAlign: 'center',
        fontFamily: fontFamily.heatwave,
        fontSize: fontSize.extraBig,
        letterSpacing: '2.5px',

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

    subtitle: {
        marginBottom: padding.lessBig,
        textAlign: 'center',
        fontFamily: fontFamily.heatwave,
        fontSize: fontSize.verySmall,
        letterSpacing: '2.5px',
       
        '@media (min-width: 750px)': {  
            fontSize: fontSize.lessSmall
        },

        '@media (min-width: 900px)': {  
            fontSize: fontSize.small
        },

        '@media (min-width: 1200px)' : {
            fontSize: fontSize.small
        }
    },

    buttonContainer: {
        display: 'flex',
        flexContainer: 'row',
        marginTop: padding.extraSmall,
        marginBottom: padding.big,
        justifyContent: 'space-evenly'
    },

    button: {
        background: color.fgWhite,
        padding: padding.verySmall,
        color: color.bgBlack,
        fontFamily: fontFamily.heatwave,
        letterSpacing: '2.5px',
        fontSize: fontSize.small,
               
        '@media (min-width: 750px)': {  
            fontSize: fontSize.lessBig
        },

        '@media (min-width: 900px)': {  
            fontSize: fontSize.big
        },

        '@media (min-width: 1200px)' : {
            fontSize: fontSize.veryBig
        }
    },

    body: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: fontFamily.josefin,
        letterSpacing: '1.5px',
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
        marginTop: padding.veryBig,
        fontFamily: fontFamily.josefin,
        letterSpacing: '1.5px',
    },

    footer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: padding.verySmall,
        fontSize: fontSize.lessSmall,
        '@media (min-width: 750px)': {  
            fontSize: fontSize.small,
        }
    },

    copyright: {
        marginTop: padding.veryBig,
        fontSize: fontSize.verySmall,
        marginBottom: padding.small
    },

    link: {
        backgroundColor: color.fgWhite,
        color: color.bgBlack,
        padding: padding.tiny
    }
}

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            isVisible: false,
            popupState: PopupState.None,
            popupType: PopupType.About
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
        if (this.state.popupType === PopupType.About) {
            content = this.getAboutContent();
        } else if (this.state.popupType === PopupType.Send) {
            content = this.getSendContent(); 
        } else {
            content = this.getScoreContent();
        }

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

    getSendContent() { 
        let bodyStyle = [styles.body, styles.mediaQueryOnText];
        let iconButton = this.getIconButton();  
        return (
            <div ref={this.content} style={styles.content}>
                <div style={styles.stretchContainer}>
                    { iconButton }
                    <div style={bodyStyle}>
                        <div style={styles.sendTitle}>SEND</div>
                        <div style={styles.subtitle}>supersynthesis</div>       
                        <div style={styles.buttonContainer}>
                            <div onClick={this.onYesHandle.bind(this)} style={styles.button}>yes</div>
                            <div onClick={this.onNoHandle.bind(this)} style={styles.button}>no</div>    
                        </div>         
                    </div>
                </div>
            </div>
        )
    }

    getScoreContent() { 
        let bodyStyle = [styles.body, styles.mediaQueryOnText];
        let iconButton = this.getIconButton();  
        return (
            <div ref={this.content} style={styles.content}>
                <div style={styles.stretchContainer}>
                    { iconButton }
                    <div style={bodyStyle}>
                        <div style={styles.sendTitle}>SCORE</div>
                        <div style={bodyStyle}>
                            <div style={styles.subtitle}>supersynthesis</div>
                            <div style={styles.subtitle}>{'Touch To Create A Score'}<br />{'Hit SEND'}</div>                               
                        </div>
                        <div style={styles.buttonContainer}>
                            <div onClick={this.onNoHandle.bind(this)} style={styles.button}>ok</div>
                        </div>         
                    </div>
                </div>
            </div>
        )
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
                        <div style={styles.title}>supersynthesis</div>
                        <div style={styles.description}>{aboutTheWork}</div>                        
                    </div>
                    { footer }
                </div>
            </div>
        )
    }

    getFooter() {
        const tim = 'https://timkwasny96.wixsite.com/site';
        const amay = 'https://amaykataria.com';
        return (
            <div style={styles.footerContainer}>
                <div style={styles.footer}>
                    <span>Created by&nbsp;</span>
                    <a 
                        style={styles.link} 
                        target='_blank' 
                        rel="noopener noreferrer" 
                        href={amay}>
                        Amay Kataria
                    </a>
                </div>
                <div style={styles.footer}>
                    <span>Sound by&nbsp;</span>
                    <a 
                        style={styles.link} 
                        target='_blank' 
                        rel="noopener noreferrer" 
                        href={tim}>
                        Timothy Kwasny
                    </a>
                </div>
                <div style={styles.copyright}>© Amay Kataria 2022</div>
            </div>
        )
    }

    onYesHandle(event) {
        event.stopPropagation();
        TimerStore.cancelReset();
        EditModeStore.setEditMode(false);
        EditModeStore.setUserInteracting(false);
        this.hidePopup(event);
        // Send the data. 
        Websocket.commitLightConfigData();
    }

    onNoHandle(event) {
        event.stopPropagation();
        EditModeStore.setUserInteracting(false);
        this.hidePopup(event);
    }

    showPopup(popupType) {
        console.log('Create a popup: ' + popupType);

        // Adjust the scroll top.
        this.content.current.scrollTop = 0; 
        this.setState({
            isVisible: true,
            popupState: PopupState.Open,
            popupType: popupType
        }); 

        // Force the user interaction to be false because we get stuck sometime in it. 
        EditModeStore.setIsPopupActive(true);
        EditModeStore.setUserInteracting(false);
    }

    hidePopup(event) {
        EditModeStore.setIsPopupActive(false);
        if (event) {
            event.stopPropagation(); 
        }
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

