# Author: Amay Kataria
# Date: 02/22/2022
# File: manager.py
# Description: Central lights manager that manages what state we are in. 
from modes.supersynthesis import Supersynthesis
from modes.supersynth import Supersynth
from modes.shm import SHM
from score.autoscore import Autoscore
from comms.relay import Relay
from enum import Enum

NUM_LIGHTS = 24

class State(Enum):
    Supersynthesis = 1 # Everything WebApp related!
    Supersynth = 2
    Autoscore = 3
    SHM = 4

NUM_LIGHTS = 24

class LightsManager: 
    def __init__(self, debugState)->None: 
        # Initialize the relay. 
        self.relay = Relay(debugState)
        # Default state is supersynthesis. 
        self.state = State.Supersynthesis
        # Supersynthesis mode. 
        self.supersynthesis = Supersynthesis(self.relay)
        # Supersynth mode. 
        self.supersynth = Supersynth(self.relay)
        # Autoscore mode. 
        self.autoscore = Autoscore(self.relay)
        # Simple Harmonic Motion
        self.shm = SHM(self.relay)
        # Call this when I want to set the mode to supersynthesis. 
        self.supersynthesis.begin()

    def update(self):
        # Update only if the current state needs it. 
        if (self.state == State.Autoscore):
            self.autoscore.update()
        elif (self.state == State.SHM):
            self.shm.update()
    
    # This function should only process the data if it's
    # in Supersynthesis mode. 
    def processLightData(self, socketData)->None: 
        # Supersynthesis is that state where all the Webapp related stuff is happening.
        # In these if conditions, decide what kind of action to take based on the data that
        # is coming from the WebApp
        if (self.state == State.Supersynthesis):  
            if ('index' in socketData): # Full payload
                self.supersynthesis.resetLights()      
            elif ('state' in socketData): # Sequencer data
                state = socketData['state']
                # Extract state and pass it to supersynthesis.
                self.supersynthesis.updateLights(state)
            else: # Synth data
                print (socketData)
                self.supersynthesis.synthNotes(socketData)
        else:
            pass
     
    def processDark(self, args):
        if (args == 1):
            # Turn off all the lights. 
            for x in range(0, NUM_LIGHTS):
                self.relay.off(x)
            # Set dark flag. 
            print('Dark True')
            self.relay.setDark(True)
        else:
            print('Dark False')
            self.relay.setDark(False)
    
    def processOscData(self, address, args): 
        # Set the right state. 
        if (address == '/push0'):
            self.state = State.Supersynthesis
            self.supersynthesis.begin()
        elif (address == '/push1'):
            self.state = State.Supersynth
            self.supersynth.begin()
        elif (address == '/push2'):
            self.state = State.Autoscore  
            self.autoscore.begin()          
        elif (address == '/push3'):
            self.state = State.SHM
            self.shm.begin()

        # Is the address coming from the supersynth multipush. 
        if ('supersynth' in address):
            # Check if it's a valid state before forwarding the message.
            self.supersynth.updateLights(address, args)
            # if (self.state == State.Supersynth):
                
        if ('shm' in address):
            self.shm.processOsc(address, args)
        
        if ('autoscore' in address): 
            self.autoscore.processOsc(address, args)

        if ('dark' in address):
            self.processDark(args)