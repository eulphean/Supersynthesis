# Parent class for all sections. 
# Some useful variables that can be used by the sections.
from time import time
from enum import Enum

class Direction(Enum):
    Right = 1
    Left = 2

class Section:
    def __init__(self, relay, numLights) -> None:
        # Save a handle of the relay.
        self.relay = relay

        # Maximum number of lights.
        self.numLights = numLights

        # Snapshot of current time. 
        self.curTime = time()

        # Single glider
        self.gliderA = -1
        self.gliderB = -1 

        # Left and Right gliders
        self.leftGlider = -1
        self.rightGlider = -1
        
        # Direction
        self.direction = Direction(Direction.Right)

        # Are lights on? 
        self.areLightsOn = False

        # Time we'll use to compare between states.
        self.stateTime = time()
    
    # Turn all the lights from start to end index together.
    def lightsOn(self, startIdx, endIdx) -> None: 
        for x in range(startIdx, endIdx):   
            self.switchOn(x)
        # Lights are on. 
        self.areLightsOn = True

    # Turn off all the lights from start to end index together.
    def lightsOff(self, startIdx, endIdx) -> None:
        for x in range(startIdx, endIdx):   
            self.switchOff(x)
        # Lights are off. 
        self.areLightsOn = False

    def switchOn(self, idx) -> None:
        self.relay.on(idx)

    def switchOff(self, idx) -> None:
        self.relay.off(idx)

    def fullTurnOff(self, reverse = False) -> None:
        if reverse:
            for x in range(0, self.numLights):
                self.switchOff(x)
        else:
            for x in reversed(range(0, self.numLights)):
                self.switchOff(x)