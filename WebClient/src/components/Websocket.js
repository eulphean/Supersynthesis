/*
  Name: Websocket.js
  Author: Amay Kataria
  Date: 02/15/2022
  Description: Class responsible for communication with the webserver. We use websockets
  technology for this. Here we have the websocket client, which communicates with backend
  server over websockets.
*/

import io  from 'socket.io-client'
import LightConfigStore from '../stores/LightConfigStore';

// const localhostURL = "http://localhost:5000";
const herokuURL = "https://supersynth.herokuapp.com";

class Websocket {
  constructor() {
      this.siteURL = herokuURL + '/app'; 

      this.socket = io(this.siteURL, {
          reconnection: true,
          reconnectionDelay: 500,
          reconnectionAttempts: Infinity
      });

      this.socket.once('connect', this.subscribe.bind(this));
  }

  subscribe() {
      console.log('Connected');
      // Subscribe to incoming events from the webserver here. 
      this.socket.on('time', this.logTime.bind(this));
      this.socket.on('receiveData', (payload) => {
        LightConfigStore.setPayloadFromDatabase(payload); 
      });

      // We are connected - trigger a request to receive data.
      this.socket.emit('getData');
  }

  // ----------------------- DATABASE CALLS --------------------- //
  saveEntry() {
    let payload = {
      'index': 0,
      'data': 'Hi this is fresh data'
    }

    this.socket.emit('saveData', payload);
  }

  // -------------------- DON'T CHANGE THESE -------------------    
  disconnect() {
      console.log('Socket Server Disconnected.');
  }

  logTime(data) {
    // console.log('Socket Connection Alive: ' + data);
  }

  commitLightConfigData() {
    let payload = LightConfigStore.getPayloadForDatabase();
    this.socket.emit('saveData', payload);
  }
}

export default new Websocket();


