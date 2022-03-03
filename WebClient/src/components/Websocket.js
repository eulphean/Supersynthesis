/*
  Name: Websocket.js
  Author: Amay Kataria
  Date: 02/15/2022
  Description: Class responsible for communication with the webserver. We use websockets
  technology for this. Here we have the websocket client, which communicates with backend
  server over websockets.
*/

import io  from 'socket.io-client'
import BpmStore from '../stores/BpmStore';
import ConfigIndexStore from '../stores/ConfigIndexStore';
import LightConfigStore from '../stores/LightConfigStore';

const localhostURL = "http://localhost:5000";
//const herokuURL = "https://supersynth.herokuapp.com";

const EVENT_SAVE_PAYLOAD = 'event_save_payload';
const EVENT_TIME = 'event_time';
const EVENT_FULL_PAYLOAD = 'event_full_payload';
const EVENT_SEQUENCER_PAYLOAD = 'event_sequencer_payload';

class Websocket {
  constructor() {
      this.siteURL = localhostURL + '/app'; 

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
      this.socket.on(EVENT_TIME, this.logTime.bind(this));
      // Show up when user starts interacting.
      this.socket.on(EVENT_FULL_PAYLOAD, (payload) => {
        this.processFullPayload(payload); 
      }); 
      // Shows the data when user is not interacting
      this.socket.on(EVENT_SEQUENCER_PAYLOAD, data => {
        LightConfigStore.setSequencerData(data);
      });
  }

  // -------------------- DON'T CHANGE THESE -------------------    
  disconnect() {
      console.log('Socket Server Disconnected.');
  }

  logTime(data) {
    // console.log('Socket Connection Alive: ' + data);
  }

  commitLightConfigData() {
    // Extract data from stores. 
    let lightConfig = LightConfigStore.getLightConfig();
    let localBpm = BpmStore.getLocalBpm();
    let configIndex = ConfigIndexStore.getConfigIndex() + 1; 

    // Create the JSON.
    this.json = {};
    this.json['bpm'] = localBpm; 
    this.json['lights'] = lightConfig; 
    this.json['time'] = Date(); 

    // Finalize payload
    let payload = {
      'index': configIndex,
      'config': JSON.stringify(this.json)
    };

    // Emit payload.
    this.socket.emit(EVENT_SAVE_PAYLOAD, payload);
  }

  processFullPayload(payload) {
    // Config index. 
    let configIndex = payload['index'];
    ConfigIndexStore.setConfigIndex(configIndex);

    let config = payload['config'];

    // Bpm.
    let bpm = config['bpm'];
    BpmStore.setDbBpm(bpm);

    // Light config.
    let lightConfig = config['lights'];
    LightConfigStore.setLightConfig(lightConfig);
  }
}

export default new Websocket();

    //     // console.log('Overwriting current config.');

    //     // // Get current index. 
    //     // this.configIndex = payload['index'];

    //     // // Config items. 
    //     // let config = payload['config'];
    //     // this.bpm = config['bpm'];


    //     // // Trigger info subscribers. 
    //     // for (let i = 0; i < this.infoSubscribers.length; i++) {
    //     //     this.infoSubscribers[i]();
    //     // }
        
    //     // // Light data is an array. Update the current light
    //     // // config with this incoming data. 
    //     // let lightData = config['lights'];
    //     // this.updateLightConfig(lightData);

    //     // //Bad assumption that this call will be successful. 
    //     // this.configIndex += 1; 
    //     // let dbConfig = this.filterConfig();
    //     // this.json = {}
    //     // this.json['bpm'] = this.localBpm; // Get the current bpm that has been set by the user. 
    //     // this.json['lights'] = dbConfig;
    //     // this.json['time'] = Date();

    //     // let payload = {
    //     //     'index' : this.configIndex, 
    //     //     'config': JSON.stringify(this.json)
    //     // }

