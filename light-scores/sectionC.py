# Section Implementation: A section is a small module that can be plugged inside a score. 
# Multiple sections can be mixed and matched to create different scores. 

from ast import Num
from time import time
from enum import Enum
from random import randint

# Max keys
Num_Keys = 8

# On time for notes. 
key_press_time = 0.5

# Maximum random notes to pick
Num_Random_Notes = Num_Keys

# Different parts of this section.
class Part(Enum):
    Random = 1
    Glide = 2

class SectionC:
    def __init__(self, relay) -> None:
        # Save a copy of the relay. 
        self.relay = relay

        # Initialize gliders. 
        self.initRandomGlider()
        self.initMovingGliders()

        # Count of random picks we have made. 
        self.randCount = 0
        
        # First state is Random
        self.part = Part(Part.Random)
        self.setupRandomGlider()

        # Time variable for comparison. 
        self.check_time = key_press_time

        # Snapshot of current time. 
        self.cur_time = time()

    def update(self) -> None:
        # How much time has elapsed?
        elapsedTime = time() - self.cur_time

        # Handle first part. 
        if (elapsedTime > self.check_time and self.part == Part.Random):
            # Are these gliders on?  
            if (self.leftGlider != -1 and self.rightGlider != -1):
                print ("***CLEAN GLIDE***")
                # Turn them off. 
                self.relay.off(self.leftGlider)
                self.relay.off(self.rightGlider)
                self.initMovingGliders()

            # Do I have anything to turn off?
            if (self.randomGlider >= 0):
                # Turn off the glider.
                self.relay.off(self.randomGlider)
            
            # Pick next counter.
            self.randCount += 1

            # Have we exceeded number of random notes?
            if (self.randCount >= Num_Random_Notes-1):
                # Initial random glider.
                self.initRandomGlider()

                # Setup moving gliders.
                self.setupMovingGliders()
                
                # Start gliding. 
                self.part = Part.Glide
            else:
                # Set a new glider.
                self.setupRandomGlider()

            # Reset time.
            self.cur_time = time()
        
        # Handle Glide
        elif (elapsedTime > self.check_time and self.part == Part.Glide):
            # Clean last random glider.
            if (self.randomGlider != -1):
                print("Clean last random.")
                self.relay.off(self.randomGlider)
                self.initRandomGlider()

            # Glide baby!
            self.glide()

            # Reset time.
            self.cur_time = time()
    
    def glide(self) -> None:
        # Turn off the gliders
        self.relay.off(self.leftGlider)
        self.relay.off(self.rightGlider)

        # Update gliders
        self.leftGlider -= 1
        self.rightGlider += 1

        # Turn them on. 
        self.relay.on(self.leftGlider)
        self.relay.on(self.rightGlider)

        # Check if gliders will go out of
        # scope in the next run.
        if (self.leftGlider == 0 and self.rightGlider == Num_Keys - 1):
            # Go to next state. 
            self.part = Part.Random
            self.randCount = 0

    def setupRandomGlider(self) -> None:
        print("********RANDOM********")

        # Create a new random glider.
        self.randomGlider = randint(0, Num_Keys - 1) # Don't include the last number
        while (self.randomGlider == self.prevGlider):
            self.randomGlider = randint(0, Num_Keys - 1)
        
        # Save current glider as previous glider.
        # Avoid duplicate randoms to be picked.
        self.prevGlider = self.randomGlider     

        # Turn on the glider. 
        self.relay.on(self.randomGlider)

    def setupMovingGliders(self) -> None:
        print("********GLIDE********")

        # Both gliders are at the center. 
        self.leftGlider = int (Num_Keys / 2) - 1
        self.rightGlider = int (Num_Keys / 2)

        # Turn on the gliders. 
        self.relay.on(self.leftGlider)
        self.relay.on(self.rightGlider)

    def initRandomGlider(self) -> None:
        self.prevGlider = -1
        self.randomGlider = -1

    def initMovingGliders(self) -> None:
        self.leftGlider = -1
        self.rightGlider = -1

    # TODO: Pending implementation.
    def reset(self) -> None:
        self.idx = 0
        self.cur_time = 0
        pass
