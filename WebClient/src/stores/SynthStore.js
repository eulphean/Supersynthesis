// Name: SynthStore.js
// Author: Amay Kataria
// Date: 04/24/2023
// Description: This data store is responsible to store, transmit, and receive 
import Websocket from "../components/Websocket";

class SynthStore {
    constructor() {
        this.localSynthStack = []; 
        // Local state of the system.
        this.localState = Array(24).fill(0);
        // Accumulated state from multiple clients.
        this.socketState = Array(24).fill(0);
    }

    // Is the local state of this index the same as the socket state?
    canModify(index) {
        return this.localState[index] === this.socketState[index]; 
    }

    setLocalNote(index, value) {
        this.localState[index] = value; 
        this.socketState[index] = value; 
        const payload = JSON.stringify(this.socketState);
        Websocket.sendSynthNotes(payload);
        // console.log('Local State: ' + this.localState);
    }

    // New data that has been received from the socket.
    setSynthNotes(data) {
        this.socketState = data; 
        // console.log('Socket State: ' + this.socketState);
    }

    getLocalNote(index, value) {
        return this.localState[index];
    }

    getSocketNote(index, value) {
        return this.socketState[index];
    }
}

export default new SynthStore(); 