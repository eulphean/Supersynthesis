# Author: Amay Kataria
# Date: 02/22/2022
# File: supersynthesis.py
# Description: The mode that is controlled by the website (supersynthesis.art).

from time import time
from enum import Enum
from random import randint, uniform
from tkinter import RIGHT
from modes.common import Common, Direction

# Default time between two notes. 
DEFAULT_INCREMENT_TIME = 0.45

# Different parts of this section.
class Part(Enum):
    Glide = 1
    Off = 2

class Supersynthesis(Common):
    def __init__(self, relay, numLights): 
        super().__init__(relay, numLights)
        # Default increment times. 
        self.incrementTime = DEFAULT_INCREMENT_TIME
        self.topLights = []
        self.bottomLights = []
        self.initLights()

    # It's like a reset. 
    def begin(self) -> None:
        print ("*******CURRENT_MODE: Supersynthesis****")

        # Complete cleanup.
        self.fullTurnOff()
        self.part = Part(Part.Glide)

        # Reset glider to left-most. 
        self.glider = 0

        # Starting direction. 
        self.direction = Direction.Right
      
        # Snapshot of current time. 
        self.curTime = time()

    def update(self) -> None:
        pass
        # elapsedTime = time() - self.curTime

        # # Glide from Right to Left or Left to Right.
        # if (elapsedTime > self.incrementTime and self.part == Part.Glide):
        #     lightVal = 0
        #     if (self.direction == Direction.Right):
        #         lightVal = self.topLights[self.glider]
        #         self.lightOn(lightVal)
        #         self.glider += 1
        #     elif (self.direction == Direction.Left):
        #         lightVal = self.bottomLights[self.glider]
        #         self.lightOn(lightVal)
        #         self.glider -= 1
        
        #     # Have I reached the right-most point?
        #     if (self.glider == self.numLights):
        #         self.part = Part.Off
        #         # Reset glider to starting pos. 
        #         self.glider = self.numLights - 1 
                        
        #     # Have I reached the left-most point?
        #     if (self.glider < 0):
        #         self.part = Part.Off
        #         # Reset glider to starting pos.
        #         self.glider = 0 

        # # Turn off all the lights. 
        # # Flip glide direction.
        # if (elapsedTime > self.incrementTime and self.part == Part.Off):
        #     self.part = Part.Glide
        #     if (self.direction == Direction.Right):
        #         self.fullTurnOff(True)
        #         self.direction = Direction.Left
        #     else:
        #         self.fullTurnOff()
        #         self.direction = Direction.Right
            
        #     # Reset time. 
        #     self.curTime = time()

    def lightOn(self, lightVal): 
        if (lightVal == 1):
            self.switchOn(self.glider)
            # Reset time to calculate the elapsed time for the next one. 
            self.curTime = time()
        else:
            pass
        
    def initLights(self) -> None: 
        for x in range(0, 24):
            self.topLights.append(randint(0, 1))
            self.bottomLights.append(randint(0, 1))

    def updateLightData(self, bpmTime, topLights, bottomLights):
        # Empty the array
        self.topLights = []
        self.topLights = topLights

        # Empty the array
        self.bottomLights = []
        self.bottomLights = bottomLights

        # Set the increment time
        # Since bpm time is in milliseconds and increment time is in seconds
        self.incrementTime = bpmTime/1000

        print(self.topLights)
        print(self.bottomLights)
        print(self.incrementTime)

        self.begin()
        pass

    def updateTestData(self, idx, val):        
        if (val == 1):
            self.switchOn(idx)
        elif (val == -1):
            self.fullTurnOff()
            pass
    
    def updateLights(self, state):
        if (state == 'NONE'):
            self.fullTurnOff()    
            return
        else:
            el = state.pop()
            idx = el['idx']
            val = el['val']
            if (val == 1):
                self.switchOn(idx)