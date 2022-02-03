# Section Implementation: A section is a small module that can be plugged inside a score. 
# Multiple sections can be mixed and matched to create different scores. 

from time import time
from enum import Enum

# Max keys
Num_Keys = 8

# On time for notes. 
key_press_time = 0.125
light_on_time = 0.25

# Different parts of this section.
class Part(Enum):
    Glide_Right = 1
    On_Right = 2
    Glide_Left = 3
    On_Left = 4

class SectionA:
    def __init__(self, relay) -> None:
        # Save a copy of the relay. 
        self.relay = relay
        # Section params.
        self.idx = 0
        # Snapshot of current time. 
        self.cur_time = time()
        # Forward (1) or backward (0)
        self.direction = True
        # Are lights on?
        self.isLightOn = False
        # First index. 
        self.relay.on(self.idx)
        # Start with first part. 
        self.part = Part(Part.Glide_Right)
        # Time variable for comparison. 
        self.check_time = key_press_time

    def glide(self, direction) -> None: 
        # Release previous key.
        self.relay.off(self.idx)
        # Change idx based on direction. 
        if (direction == True):
            # Increment key.
            self.idx += 1
        else:
            # Decrement key. 
            self.idx -= 1
        # Press next key. 
        self.relay.on(self.idx)
        # Have we reached extreme right?
        if (self.idx == Num_Keys):
            self.part = Part.On_Right
        # Have we reached extreme left?
        if (self.idx == 0):
            self.part = Part.On_Left

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

    def update(self) -> None:
        elapsedTime = time() - self.cur_time
        
        # For keeping lights on, we use a different time checker. 
        if (self.isLightOn == True):
            self.check_time = light_on_time
        else:
            self.check_time = key_press_time

        # Handle first part. 
        if (elapsedTime > self.check_time and self.part == Part.Glide_Right):
            # Are lights on?
            if (self.isLightOn):
                self.light_off(0, 4)
            # Glide left to right. 
            self.glide(True)
            # Reset current time. 
            self.cur_time = time()

        # Handle second part.
        elif (elapsedTime > self.check_time and self.part == Part.On_Right):
            self.light_on(4, Num_Keys)
            # Update to next state. 
            self.part = Part.Glide_Left
            # Reset current time. 
            self.cur_time = time()

        # Handle third part.
        elif (elapsedTime > self.check_time and self.part == Part.Glide_Left):
            # Are lights on? 
            if (self.isLightOn):
                self.light_off(4, Num_Keys)
            # Glide right to left. 
            self.glide(False)
            # Reset current time.
            self.cur_time = time()

        # Handle fourth part.
        elif (elapsedTime > self.check_time and self.part == Part.On_Left):
            self.light_on(0, 4)
            # Update to next state.
            self.part = Part.Glide_Right
            # Reset current time. 
            self.cur_time = time()

    def reset(self) -> None:
        self.idx = 0
        self.cur_time = 0
        pass
