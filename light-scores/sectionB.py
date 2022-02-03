# Section Implementation: A section is a small module that can be plugged inside a score. 
# Multiple sections can be mixed and matched to create different scores. 

from ast import Num
from py_compile import _get_default_invalidation_mode
from time import time
from enum import Enum

# Max keys
Num_Keys = 8

# On time for notes. 
key_press_time = 0.125
light_on_time = 0.1

# Max number of times we bounce between two states. 
max_ping_pong_count = 5

# Different parts of this section.
class Part(Enum):
    Glide = 1
    Light_On = 2
    Light_Off = 3

class SectionB:
    def __init__(self, relay) -> None:
        # Save a copy of the relay. 
        self.relay = relay
        
        # Setup gliders that'll be traversing the light. 
        # Start by turning on these lights. 
        self.set_glider()

        # Time variable for comparison. 
        self.check_time = key_press_time
        # Are lights on?
        self.isLightOn = False
        # Snapshot of current time. 
        self.cur_time = time()
        # Counts how many times we ping pong between two states.
        self.pingPongCounter = 0

        # Set the first part.
        self.part = Part(Part.Glide)

    def glide(self) -> None: 
        # Turn off the gliders.
        self.relay.off(self.leftGlider)
        self.relay.off(self.rightGlider)

        # Increment the glider
        self.leftGlider += 1
        self.rightGlider -= 1

        # Turn on gliders
        self.relay.on(self.leftGlider)
        self.relay.on(self.rightGlider)

        # Have they reached the center?
        if (self.leftGlider > self.rightGlider):
            self.part = Part.Light_On
    
    def light_on(self, startIdx, endIdx) -> None: 
        for x in range(startIdx, endIdx):   
            self.relay.on(x)
        # Lights are on. 
        self.isLightOn = True

    def light_off(self, startIdx, endIdx) -> None:
        for x in range(startIdx, endIdx):   
            self.relay.off(x)
        # Lights are off. 
        self.isLightOn = False

    def set_glider(self) -> None:
        self.leftGlider = 0
        self.rightGlider = Num_Keys - 1
        self.relay.on(self.leftGlider)
        self.relay.on(self.rightGlider)

    def update(self) -> None:
        elapsedTime = time() - self.cur_time
        
        # For keeping lights on, we use a different time checker. 
        if (self.isLightOn == True):
            self.check_time = light_on_time
        else:
            self.check_time = key_press_time

        # Handle first part. 
        if (elapsedTime > self.check_time and self.part == Part.Glide):
            # Are lights on?
            if (self.isLightOn):
                self.light_off(0, Num_Keys)

            # Sweep the gliders. 
            self.glide()
            # Reset current time. 
            self.cur_time = time()

        elif (elapsedTime > self.check_time and self.part == Part.Light_On):
            self.light_on(0, Num_Keys)
            self.pingPongCounter += 1
            self.part = Part.Light_Off 
            self.cur_time = time()

        elif (elapsedTime > self.check_time and self.part == Part.Light_Off):
            self.light_off(0, Num_Keys)
            if(self.pingPongCounter < 5):
                self.part = Part.Light_On
            else:
                self.part = Part.Glide
                self.pingPongCounter = 0
                # Set the gliders back on.
                self.set_glider()
            self.cur_time = time()
            
    
    def reset(self) -> None:
        # TODO Implement this.
        pass