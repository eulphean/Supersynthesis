# A class to do all the logic for SHM here. 
from math import sin, pi
from time import time

WIN_WIDTH = 800
CENTER_POS = WIN_WIDTH / 2

# Helper map function. 
def mapRange(value, inMin, inMax, outMin, outMax):
    return outMin + (((value - inMin) / (inMax - inMin)) * (outMax - outMin))

class Light:
    def __init__(self, idx, curPos, angle):
        self.idx = idx # Current idx of the light.
        self.curPos = curPos # Start with being in the center.
        self.prevPos = self.curPos # Keep track of previous position.
        self.angle = angle # Starting angle.
        self.lightOn = False # Is light on?

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
            print("*****************************Light On:" + str(self.idx))
            self.lightOn = True
        
        # Upward intersect.
        elif (self.curPos < comparePos and self.prevPos > comparePos and self.lightOn == False):
            print("*****************************Light On:" + str(self.idx))
            self.lightOn = True
        
        else:
            if (self.lightOn):
                self.lightOn = False
                print("********************************Light Off:" + str(self.idx))
            else:
                pass

class ControlPoint:
    def __init__(self, idx, curPos, angle, numLights):
        self.idx = idx
        self.curPos = curPos
        # Period is 2PI - A single sine wave.
        # Change the period to change the shape of the control wave. 
        self.angle = mapRange(angle, 0, numLights, 0, 2 * pi)

    # As we change maxAmp, the control points also scale up.
    def update(self, maxAmp):
        self.curPos = mapRange(sin(self.angle), -1, 1, CENTER_POS - maxAmp, CENTER_POS + maxAmp)

class SHM:
    def __init__(self, numLights):
        self.maxAmp = 50 # Change this with a slider.
        self.slowFactor = 0.05 # Change this with a slider.
        self.lights = []
        self.ctrlPoints = []
        self.setup(numLights)
        print("SHM Setup Complete")
    
    def setup(self, numLights):
        self.setupLights(numLights)
        self.setupControlPoints(numLights)
    
    def update(self):
        for l in self.lights:
            l.update(self.slowFactor, self.maxAmp)
        
        for p in self.ctrlPoints:
            p.update(self.maxAmp)

    # Setup all the lights.
    def setupLights(self, numLights):
        for i in range(0, numLights):
            light = Light(i, CENTER_POS, i+1) # idx, curPos, angle. (Angle always starts with 1)
            self.lights.append(light)

    # Setup controls points with respect to which we can control intersection points.
    def setupControlPoints(self, numLights):
        for i in range(0, numLights):
            point = ControlPoint(i, CENTER_POS, i, numLights) # idx, curPos, angle. (Angle always starts with 1)
            self.ctrlPoints.append(point)