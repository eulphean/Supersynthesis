# This implementation is for the section that I'm thinking to implement at the exhibition.
# This section is a very close simulation of how the piece will operate at the exhibition
# based on user input. 
from time import time
from enum import Enum
from random import randint, uniform
from section import Section, Direction
from pd import PD

# On time for notes. 
Random_Press_Time = 0.125
Key_Press_Time = 0.45

# Different parts of this section.
class Part(Enum):
    Glide = 1
    Off = 2

class SectionD(Section):
    def __init__(self, relay, numLights) -> None:
        super().__init__(relay, numLights)
        print ("Init: SectionD")
        self.reset()

    def begin(self) -> None:
        # Complete cleanup.
        self.fullTurnOff()
        self.part = Part(Part.Glide)

        # Fill slots with some random values. 
        self.initSlots()
        # Index to keep track of which slot we are accessing.
        self.slotIdx = 0 

        # Reset glider to left-most. 
        self.glider = 0

        # Starting direction. 
        self.direction = Direction.Right
      
        # Snapshot of current time. 
        self.curTime = time()

        self.keyPressTime = Key_Press_Time

    def update(self) -> None:
        elapsedTime = time() - self.curTime

        # Glide. 
        if (elapsedTime > self.keyPressTime and self.part == Part.Glide):
            # Slot value that decides if the light will
            # be on or not. 
            v = self.slots[self.slotIdx]
            self.slotIdx += 1

            if (v == 1):
                self.switchOn(self.glider)
                self.curTime = time()
            else:
                pass

            # Increment glider based on the direction we are going. 
            if (self.direction == Direction.Right):
                self.glider += 1            
            elif (self.direction == Direction.Left):
                self.glider -= 1

            # Have I reached the right-most point?
            if (self.slotIdx == self.numLights):
                self.part = Part.Off
                # Reset glider to starting pos. 
                self.glider = self.numLights - 1 
            
            # Have I reached the left-most point?
            if (self.slotIdx == self.numLights * 2):
                self.part = Part.Off
                # Reset glider to starting pos.
                self.glider = 0 
                self.slotIdx = 0
                # Initialize the slots again.
                self.initSlots()
                self.initKeyPressTime()

        # Turn off all the lights. 
        # Flip glide direction.
        if (elapsedTime > self.keyPressTime and self.part == Part.Off):
            self.part = Part.Glide
            if (self.direction == Direction.Right):
                self.fullTurnOff(True)
                self.direction = Direction.Left
            else:
                self.fullTurnOff()
                self.direction = Direction.Right
            
            # Reset time. 
            self.curTime = time()

    # Randomize key press time.
    def initKeyPressTime(self) -> None:
        self.keyPressTime = uniform(0.1, 0.8)

    def initSlots(self) -> None:
        self.slots = []
        for x in range(0, 48):
            self.slots.append(randint(0, 1))

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

    def reset(self) -> None:
        pass