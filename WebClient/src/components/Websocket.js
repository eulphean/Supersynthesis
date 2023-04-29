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
import SequencerStore from '../stores/SequencerStore';
import ModeStore from '../stores/ModeStore';
import SynthStore from '../stores/SynthStore';

//const localhostURL = "http://localhost:5000";
const herokuURL = "https://supersynth.herokuapp.com";

const EVENT_SCORE_PAYLOAD = 'event_score_payload';
const EVENT_TIME = 'event_time';
const EVENT_FULL_PAYLOAD = 'event_full_payload';
const EVENT_SEQUENCER_PAYLOAD = 'event_sequencer_payload';

// SYNTH events
const EVENT_SYNTH_NOTES = 'event_synth_notes';

// Mode events
const EVENT_MODE_PAYLOAD = 'event_mode_payload';

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
      this.socket.on(EVENT_TIME, this.logTime.bind(this));
      // Show up when user starts interacting.
      this.socket.on(EVENT_FULL_PAYLOAD, (payload) => {
        this.processFullPayload(payload); 
      }); 
      // Shows the data when user is not interacting
      this.socket.on(EVENT_SEQUENCER_PAYLOAD, data => {
        SequencerStore.setSequencerData(data);
      });
      // Read the initial data about the Modes.
      this.socket.on(EVENT_MODE_PAYLOAD, (currentMode) => {
        ModeStore.setMode(currentMode, false);
      });
      this.socket.on(EVENT_SYNTH_NOTES, data => {
        SynthStore.setSynthNotes(data);
      });
  }

  // -------------------- DON'T CHANGE THESE -------------------    
  disconnect() {
      console.log('Socket Server Disconnected.');
  }

  logTime(data) {
    // console.log('Socket Connection Alive: ' + data);
  }

  sendSynthNotes(payload) {
    this.socket.emit(EVENT_SYNTH_NOTES, payload);
  }

  commitModeData() {
    // Store mode data to the database.
    let currentMode = ModeStore.getCurrentMode();
    this.socket.emit(EVENT_MODE_PAYLOAD, currentMode);
  }

  commitLightConfigData() {
    // Extract data from stores. 
    let lightConfig = LightConfigStore.getActiveLightConfig();
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
    this.socket.emit(EVENT_SCORE_PAYLOAD, payload);
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

    // Clear the current configuration so we can restart 
    // again. 
    SequencerStore.clearConfig();
  }
}

export default new Websocket();