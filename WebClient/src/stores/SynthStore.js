// Name: SynthStore.js
// Author: Amay Kataria
// Date: 04/24/2023
// Description: This data store is responsible to store, transmit, and receive 
import Websocket from "../components/Websocket";

class SynthStore {
    constructor() {
        this.localSynthStack = []; 
        // Accumulated state from multiple clients.
        this.socketState = '';
    }

    // Is the local state of this index the same as the socket state?
    canModify(index) {
        return this.localState[index] === this.socketState[index]; 
    }

    setLocalNote(index, newValue) {
        // Have I connected to the app? 
        if (this.socketState) {
            // Socket config data
            const socketConfigAtIndex = this.socketState[index];
            const socketIdAtIndex = socketConfigAtIndex['socketId'];
            const valueAtIndex = socketConfigAtIndex['val'];

            // Current socketId
            const socketId = Websocket.socketId; 

            // 0 -> 1
            if (valueAtIndex === 0 && newValue === 1) {
                // console.log('0 to 1');
                const payload = [index, newValue, Websocket.socketId];
                Websocket.sendSynthNote(JSON.stringify(payload));
            }

            // 1 -> 0
            if ((valueAtIndex === 1) && (newValue === 0) && (socketId === socketIdAtIndex)) {
                // console.log('1 to 0');
                const payload = [index, newValue, Websocket.socketId];
                Websocket.sendSynthNote(JSON.stringify(payload));
            }
        }
    }

    // New data that has been received from the socket.
    setSynthNotes(data) {
        // console.log(data);
        this.socketState = data; 
        // console.log('Socket State: ' + this.socketState);
    }

    getLocalNote(index, value) {
        return this.localState[index];
    }

    getSocketStateAtIndex(index) {
        if (this.socketState) {
            return this.socketState[index];
        } else {
            return null; 
        }
    }
}

export default new SynthStore(); 