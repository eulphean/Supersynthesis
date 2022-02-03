# Section Implementation: A section is a small module that can be plugged inside a score. 
# Multiple sections can be mixed and matched to create different scores. 
from re import S
from time import time
from enum import Enum
from random import randint
from section import Section

# On time for notes. 
Key_Press_Time = 0.25

# Different parts of this section.
class Part(Enum):
    Random = 1
    Glide = 2

class SectionC(Section):
    def __init__(self, relay, numLights) -> None:
        super().__init__(relay, numLights)
        print ("Init: SectionC")
        self.reset()

    def begin(self) -> None:
        # Complete cleanup.
        self.fullTurnOff()
        self.setRandomGlider()        
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

    def initRandomGlider(self) -> None:
        # Main random glider.
        self.gliderA = -1
        # Previous random glider.
        self.gliderB = -1

    def initMovingGliders(self) -> None:
        self.leftGlider = -1
        self.rightGlider = -1

    def reset(self) -> None:
        # Initialize gliders. 
        self.initRandomGlider()
        self.initMovingGliders()
        # Count of random picks we have made. 
        self.randCount = 0
        # Time variable for comparison. 
        self.stateTime = Key_Press_Time
        # Max random notes to be picked.
        self.maxRandomNotes = self.numLights
        # First state is Random
        self.part = Part(Part.Random)
