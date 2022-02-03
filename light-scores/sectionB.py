# Section Implementation: A section is a small module that can be plugged inside a score. 
# Multiple sections can be mixed and matched to create different scores. 
from time import time
from enum import Enum
from section import Section

# On time for notes. 
Key_Press_Time = 0.125
Lights_On_Time = 0.1

# Max number of times we bounce between two states. 
Max_Ping_Pong_Count = 5

# Different parts of this section.
class Part(Enum):
    Glide = 1
    Blink = 2

class SectionB(Section):
    def __init__(self, relay, numLights) -> None:
        super().__init__(relay, numLights)
        print ("Init: SectionB")
        self.reset()

    def begin(self) -> None:
        # Complete cleanup.
        self.fullTurnOff()
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
                # Turn off previous gliders.
                self.switchOff(self.leftGlider)
                self.switchOff(self.rightGlider)

                # Turn on all the lights. 
                self.lightsOn(0, self.numLights)
                self.stateTime = Lights_On_Time
            
            # Have we ping ponged enough?
            if (self.pingPongCounter == Max_Ping_Pong_Count-1):
                # Reset ping pong counter.
                self.pingPongCounter = 0

                # Reset gliders back to original position.
                # Light them up.
                self.leftGlider = 0
                self.rightGlider = self.numLights-1
                self.switchOn(self.leftGlider)
                self.switchOn(self.rightGlider)
                
                # Reset time back to original time.
                self.stateTime = Key_Press_Time
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

        # Turn on new gliders.
        self.switchOn(self.leftGlider)
        self.switchOn(self.rightGlider)

        # Have they crossed the center?
        if (self.leftGlider > self.rightGlider):
            self.part = Part.Blink

    def reset(self) -> None:
        # Initialize the two gliders.
        self.leftGlider = 0
        self.rightGlider = self.numLights - 1
        # Time variable for comparison. 
        self.stateTime = Key_Press_Time
        # Counts how many times we ping pong between two states.
        self.pingPongCounter = 0
        # Set the first part to start with.
        self.part = Part(Part.Glide)