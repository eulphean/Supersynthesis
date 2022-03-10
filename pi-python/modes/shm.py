# A class to do all the logic for SHM here. 
from math import sin, pi
from time import time
from modes.common import Common

WIN_WIDTH = 800
CENTER_POS = WIN_WIDTH / 2
MAX_AMP = 50
# This slows down the period of the pattern.
SLOW_FACTOR = 0.025
# This adjusts the speed of the loop. 
# We want to control it to control the on/off
# time of the light. 
NOTE_TIME = 0.1
# Total lights.
NUM_LIGHTS = 24

# Helper map function. 
def mapRange(value, inMin, inMax, outMin, outMax):
    return outMin + (((value - inMin) / (inMax - inMin)) * (outMax - outMin))

class Light:
    def __init__(self, shm, idx, curPos, angle):
        self.idx = idx # Current idx of the light.
        self.curPos = curPos # Start with being in the center.
        self.prevPos = self.curPos # Keep track of previous position.
        self.angle = angle # Starting angle.
        self.lightOn = False # Is light on?
        self.shm = shm

    def update(self, slowFactor, maxAmp):
        # Calculate the new position. 
        newPos = sin(self.angle * slowFactor * time())

        # Map this position on the X axis.
        newPos = mapRange(newPos, -1, 1, CENTER_POS - maxAmp, CENTER_POS + maxAmp)
        self.curPos = newPos

        # Are we touching the center or any control points?
        self.intersect()
        
        # Save previous value.
        self.prevPos = self.curPos
    
    def intersect(self):
        # checkPointPos = cPoint.pos[0]
        comparePos = CENTER_POS

        # Downward intersect.
        if (self.curPos > comparePos and self.prevPos < comparePos and self.lightOn == False):
            # Turn on the light.
            self.shm.switchOn(self.idx)
            self.lightOn = True
        
        # Upward intersect.
        elif (self.curPos < comparePos and self.prevPos > comparePos and self.lightOn == False):
            self.shm.switchOn(self.idx)
            self.lightOn = True
        
        else:
            if (self.lightOn):
                self.lightOn = False
                self.shm.switchOff(self.idx)
            else:
                pass

class SHM(Common):
    def __init__(self, relay):
        super().__init__(relay)
    
    def begin(self):
        print('*************MODE:SHM*************')
        self.fullTurnOff()
        self.maxAmp = MAX_AMP # Change this with a slider.
        self.slowFactor = SLOW_FACTOR # Change this with a slider.
        self.noteTime = NOTE_TIME
        self.lights = []
        self.curTime = time()
        self.setupLights()
    
    def update(self):
        elapsedTime = time() - self.curTime
        if (elapsedTime > self.noteTime):
            # Elapsed the note time.
            for l in self.lights:
                l.update(self.slowFactor, self.maxAmp)
        
            # Reset current time and start counting again
            self.curTime = time()

    # Setup all the lights.
    def setupLights(self):
        for i in range(0, NUM_LIGHTS):
            light = Light(self, i, CENTER_POS, i+1) # idx, curPos, angle. (Angle always starts with 1)
            self.lights.append(light)

    def processOsc(self, address, args):
        if ('noteTime' in address):
            self.noteTime = args
        if ('maxAmp' in address):
            self.maxAmp = args