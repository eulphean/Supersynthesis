# Author: Amay Kataria
# Date: 02/25/2022
# File: sectionB.py

# Section Implementation: A section is a small module that can be plugged inside a score. 
# Multiple sections can be mixed and matched to create different scores. 
from time import time
from enum import Enum
from modes.common import Common

# On time for notes. 
Key_Press_Time = 0.125
Lights_On_Time = 0.25

# Max number of times we bounce between two states. 
Max_Ping_Pong_Count = 2

# Different parts of this section.
class Part(Enum):
    Glide = 1
    Blink = 2

class SectionB(Common):
    def __init__(self, relay) -> None:
        super().__init__(relay)
        print ("Init: SectionB")

    def begin(self) -> None:
        # Complete cleanup.
        self.fullTurnOff()

        # Initialize the two gliders.
        self.leftGlider = 0
        self.rightGlider = self.numLights - 1
        # Time variable for comparison.
        self.keyPressTime = Key_Press_Time
        self.lightsOnTime = Lights_On_Time
        self.stateTime = self.keyPressTime
        # Counts how many times we ping pong between two states.
        self.maxPingPongCount = Max_Ping_Pong_Count
        self.pingPongCounter = 0
        # Set the first part to start with.
        self.part = Part(Part.Glide)

        # Turn on both the gliders.
        self.switchOn(self.leftGlider)
        self.switchOn(self.rightGlider)

        # Snapshot of current time.
        self.curTime = time()

    def update(self) -> None:
        elapsedTime = time() - self.curTime
        # Handle first part. 
        if (elapsedTime > self.stateTime and self.part == Part.Glide):
            # Glide.
            self.glide()
            # Reset current time. 
            self.curTime = time()

        elif (elapsedTime > self.stateTime and self.part == Part.Blink):
            if (self.areLightsOn):
                # turn off the lights. 
                self.lightsOff(0, self.numLights)
                self.pingPongCounter += 1
            else:
                # Turn on all the lights. 
                self.lightsOn(0, self.numLights)
                self.stateTime = self.lightsOnTime
            
            # Have we ping ponged enough?
            if (self.pingPongCounter > self.maxPingPongCount):
                # Reset ping pong counter.
                self.pingPongCounter = 0

                # Reset gliders back to original position.
                # Light them up.
                self.leftGlider = 0
                self.rightGlider = self.numLights-1
                self.switchOn(self.leftGlider)
                self.switchOn(self.rightGlider)
                
                # Reset time back to original time.
                self.stateTime = self.keyPressTime
                # Move back to glide.
                self.part = Part.Glide

            # Take a snapshot of current time.
            self.curTime = time()
            
    def glide(self) -> None: 
        # Turn off the gliders.
        self.switchOff(self.leftGlider)
        self.switchOff(self.rightGlider)

        # Increment the two gliders.
        self.leftGlider += 1
        self.rightGlider -= 1

        # Have they crossed the center?
        if (self.leftGlider > self.rightGlider):
            self.part = Part.Blink
        else:
            # Turn on new gliders.
            self.switchOn(self.leftGlider)
            self.switchOn(self.rightGlider)
    
    def processOsc(self, address, args):
        if ('noteOn' in address):
            self.keyPressTime = args * 0.5 # 0-0.5
        elif ('lightsOn' in address):
            self.lightsOnTime = args * 0.25 # 0-0.25
        elif ('pingPong' in address):
            self.maxPingPongCount = args * 10 #0-0.25