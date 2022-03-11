// Name: TimerStore.js
// Author: Amay Kataria. 
// Date: 03/11/2022
// Description: A simple data store to start a timer whenever a user stops interacting on the screen.
// This time helps us schedule some events like initiating a popup for sending a message.

const POPUP_TIME = 500;
const RESET_TIME = 10000; 
class TimerStore {
    constructor() {
        this.isEditMode = false; 

        this.popupListener = ''; 
        this.resetListener = '';
        this.resetTimerId = ''; 
        this.popupTimerId = ''
    }

    subscribePopup(listener) {
        this.popupListener = listener; 
    }

    subscribeReset(listener) {
        this.resetListener = listener; 
    }

    startTimer() {
        if (this.popupTimerId !== '') {
            clearTimeout(this.popupTimerId);
        }
        this.popupTimerId = setTimeout(this.showPopup.bind(this), POPUP_TIME);

        if (this.resetTimerId !== '') {
            clearTimeout(this.resetTimerId); 
        }
        this.resetTimerId = setTimeout(this.reset.bind(this), RESET_TIME); 
    }
    
    showPopup() {
        this.popupListener(); 
        this.popupTimerId = ''; 
    }

    reset() {
        console.log('Trigger reset');
        this.resetListener(); 
    }

    cancelReset() {
        if (this.resetTimerId !== '') {
            console.log('Clearing Reset');
            clearTimeout(this.resetTimerId);
            this.resetTimerId = ''; 
        }
    }

    cancelPopup() {
        console.log('Clearing Popup');
        clearTimeout(this.popupTimerId);
        this.popupTimerId = '';
    }
}

export default new TimerStore();