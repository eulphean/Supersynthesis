# Author: Amay Kataria
# Date: 02/25/2022
# File: sectionA.py

# Section Implementation: A section is a small module that can be plugged inside a score. 
# Multiple sections can be mixed and matched to create different scores. 
from time import time
from enum import Enum
from modes.common import Common, Direction

# On time for notes. 
Key_Press_Time = 0.125
Lights_On_Time = 0.08

# Different parts of this section.
class Part(Enum):
    Glide_Right = 1
    On_Right = 2
    Glide_Left = 3
    On_Left = 4

class SectionA(Common):
    # Section initialization
    def __init__(self, relay) -> None:
        # Call super class
        super().__init__(relay)
        print ("Init: SectionA")
    
    def begin(self) -> None:
        # Complete cleanup.
        self.fullTurnOff()

        # Setup variables. 
        self.stateTime = Key_Press_Time
        self.direction = Direction.Right
        self.part = Part(Part.Glide_Right)
        self.gliderA = 0

        # Light up the first glider. 
        self.switchOn(self.gliderA)

        # Snapshot of current time. 
        self.curTime = time()

    def update(self) -> None:
        elapsedTime = time() - self.curTime

        # Glide from left to right.
        if (elapsedTime > self.stateTime and self.part == Part.Glide_Right):
            # Glide left to right. 
            self.glide(True)
            # Reset current time. 
            self.curTime = time()

        # Turn on and off half the lights on the right.
        elif (elapsedTime > self.stateTime and self.part == Part.On_Right):
            if (self.areLightsOn):
                # Turn off half the lights on the right.
                # Reset glider for next state.
                self.lightsOff(int(self.numLights/2), self.numLights)
                self.gliderA = self.numLights - 1
                self.switchOn(self.gliderA)
                self.part = Part.Glide_Left
                # Reset state time.
                self.stateTime = Key_Press_Time
            else:
                # Turn off pending glider light.
                self.switchOff(self.gliderA)
                # Turn on half the lights on the right.
                self.lightsOn(int(self.numLights/2), self.numLights)
                # Update state time.
                self.stateTime = Lights_On_Time
            
            # Reset current time. 
            self.curTime = time()

        # Glide right to left.
        elif (elapsedTime > self.stateTime and self.part == Part.Glide_Left):
            # Glide right to left. 
            self.glide(False)
            # Reset current time.
            self.curTime = time()

        # Turn on and off half the lights on the left.
        elif (elapsedTime > self.stateTime and self.part == Part.On_Left):
            if (self.areLightsOn):
                # Turn off half the lights on the left.
                self.lightsOff(0, int(self.numLights/2))
                self.gliderA = 0
                self.switchOn(self.gliderA)
                self.part = Part.Glide_Right
                # Reset state time.
                self.stateTime = Key_Press_Time
            else:
                # Turn off pending glider light.
                self.switchOff(self.gliderA)
                self.lightsOn(0, int(self.numLights/2))
                self.stateTime = Lights_On_Time

            # Reset current time. 
            self.curTime = time()
    
    def glide(self, direction) -> None: 
        # Turn off previous light.
        self.switchOff(self.gliderA)
        # Change idx based on direction. 
        if (direction == True):
            # Increment key.
            self.gliderA += 1
        else:
            # Decrement key. 
            self.gliderA = self.gliderA - 1
        # Turn on the current glider.
        self.switchOn(self.gliderA)

        # Have we reached extreme right?
        if (self.gliderA == self.numLights-1):
            self.part = Part.On_Right
            print("On Right...")

        # Have we reached extreme left?
        if (self.gliderA == 0):
            print("On Left...")
            self.part = Part.On_Left
