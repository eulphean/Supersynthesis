# Author: Amay Kataria
# Date: 02/25/2022
# File: sectionC.py

# Section Implementation: A section is a small module that can be plugged inside a score. 
# Multiple sections can be mixed and matched to create different scores. 
from time import time
from enum import Enum
from random import randint
from modes.common import Common

# On time for notes. 
Random_Press_Time = 0.125
Key_Press_Time = 0.25

# Different parts of this section.
class Part(Enum):
    Random = 1
    Glide = 2

class SectionC(Common):
    def __init__(self, relay) -> None:
        super().__init__(relay)
        print ("Init: SectionC")

    def begin(self) -> None:
        # Complete cleanup.
        self.fullTurnOff()

        #Initialize gliders.
        self.setRandomGlider()    
        self.initMovingGliders()

        # Count of random picks we have made. 
        self.randCount = 0
        # Time variable for comparison. 
        self.stateTime = Random_Press_Time
        # Max random notes to be picked.
        self.maxRandomNotes = self.numLights
        # First state is Random
        self.part = Part(Part.Random)
    
        # Snapshot of current time. 
        self.curTime = time()

    def update(self) -> None:
        # Calculate elapsed time.
        elapsedTime = time() - self.curTime

        # Handle random picking.
        if (elapsedTime > self.stateTime and self.part == Part.Random):
            # Turn off random glider.
            self.switchOff(self.gliderA)
            # Pick next counter.
            self.randCount += 1
            # Have we exceeded number of random notes?
            if (self.randCount < self.maxRandomNotes):
                # Set a new glider.
                self.setRandomGlider()
            else:
                # Reset random count.
                self.randCount = 0
                # Setup moving gliders.
                self.setMovingGliders()
                # Start gliding. 
                self.part = Part.Glide
                self.stateTime = Key_Press_Time

            # Reset time.
            self.curTime = time()
        
        # Handle glide.
        elif (elapsedTime > self.stateTime and self.part == Part.Glide):
            # Turn off the gliders.
            self.switchOff(self.leftGlider)
            self.switchOff(self.rightGlider)

            # Update gliders.
            self.leftGlider -= 1
            self.rightGlider += 1
            
            # Is it a valid glider?
            if (self.leftGlider < 0 and self.rightGlider > self.numLights - 1):
                # Go to next state. 
                self.setRandomGlider()
                self.part = Part.Random
                self.stateTime = Random_Press_Time
            else:
                # Turn them on. 
                self.switchOn(self.leftGlider)
                self.switchOn(self.rightGlider)

            # Reset time.
            self.curTime = time()

    def setRandomGlider(self) -> None:
        # Create a new random glider.
        self.gliderA = randint(0, self.numLights - 1) # Don't include the last number
        while (self.gliderA == self.gliderB):
            self.gliderA = randint(0, self.numLights - 1)
        # Save current glider as previous glider.
        self.gliderB = self.gliderA     
        # Turn on the glider. 
        self.switchOn(self.gliderA)

    def setMovingGliders(self) -> None:
        # Both gliders are at the center. 
        self.leftGlider = int (self.numLights / 2) - 1
        self.rightGlider = int (self.numLights / 2)
        # Turn on the gliders. 
        self.switchOn(self.leftGlider)
        self.switchOn(self.rightGlider)

    def initMovingGliders(self) -> None:
        self.leftGlider = -1
        self.rightGlider = -1