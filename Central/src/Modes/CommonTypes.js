
// Author: Amay Kataria
// Date: 04/23/2023
// File: CommonTypes.js
// Description: Common types (modes, events) used throughout the backend for socket communication 
// and handling mode business logic.

const MODES = {
    SYNTH: 0,
    DREAM: 1, 
    SCORE: 2, 
    SWEEP: 3
};

const EVENTS = {
    EVENT_FULL_PAYLOAD: 'event_full_payload',
    EVENT_SYNTH_NOTES: 'event_synth_notes',
    EVENT_MODE_PAYLOAD: 'event_mode_payload',
    EVENT_SCORE_PAYLOAD: 'event_score_payload'
}

module.exports = {
    MODES: MODES,
    EVENTS: EVENTS
}