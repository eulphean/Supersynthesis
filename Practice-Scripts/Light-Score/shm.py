# A class to do all the logic for SHM here. 
from math import sin, pi
from time import time

from pd import PD

WIN_WIDTH = 800
CENTER_POS = WIN_WIDTH / 2
# 0 Prefix is reserved for sending index of the lights.
PD_MSG_PREFIX = "0 "
MAX_AMP = 50
# This slows down the period of the pattern.
SLOW_FACTOR = 0.05
# This adjusts the speed of the loop. 
# We want to control it to control the on/off
# time of the light. 
NOTE_TIME = 0.1

# Global PD object to interact with PureData.
g_Pd = PD()

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

    def update(self, relay, slowFactor, maxAmp):
        # Calculate the new position. 
        newPos = sin(self.angle * slowFactor * time())

        # Map this position on the X axis.
        newPos = mapRange(newPos, -1, 1, CENTER_POS - maxAmp, CENTER_POS + maxAmp)
        self.curPos = newPos

        # Are we touching the center or any control points?
        self.intersect(relay)
        
        # Save previous value.
        self.prevPos = self.curPos
    
    def intersect(self, relay):
        # checkPointPos = cPoint.pos[0]
        comparePos = CENTER_POS

        # Downward intersect.
        if (self.curPos > comparePos and self.prevPos < comparePos and self.lightOn == False):
            # Turn on the light.
            print("*****************************Light On:" + str(self.idx))
            message = PD_MSG_PREFIX + str(self.idx) + ' 1;'
            # Send the index of the current light. 
            g_Pd.send2pd(message)
            relay.on(self.idx)
            self.lightOn = True
        
        # Upward intersect.
        elif (self.curPos < comparePos and self.prevPos > comparePos and self.lightOn == False):
            print("*****************************Light On:" + str(self.idx))
            message = PD_MSG_PREFIX + str(self.idx) + ' 1;'
            g_Pd.send2pd(message)
            relay.on(self.idx)
            self.lightOn = True
        
        else:
            if (self.lightOn):
                self.lightOn = False
                relay.off(self.idx)
                print("********************************Light Off:" + str(self.idx))
                message = PD_MSG_PREFIX + str(self.idx) + ' 0;'
                g_Pd.send2pd(message)
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
    def __init__(self, relay, numLights):
        self.relay = relay
        self.maxAmp = MAX_AMP # Change this with a slider.
        self.slowFactor = SLOW_FACTOR # Change this with a slider.
        self.lights = []
        self.ctrlPoints = []
        #self.fullTurnOff(numLights)
        self.curTime = time()
        self.setup(numLights)
        
        print("SHM Setup Complete")
    
    def setup(self, numLights):
        self.setupLights(numLights)
        self.setupControlPoints(numLights)
    
    def update(self):
        elapsedTime = time() - self.curTime
        if (elapsedTime > NOTE_TIME):
            # Elapsed the note time.
            for l in self.lights:
                l.update(self.relay, self.slowFactor, self.maxAmp)
            
            for p in self.ctrlPoints:
                p.update(self.maxAmp)

            # Reset current time and start counting again
            self.curTime = time()

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
    
    def fullTurnOff(self, numLights) -> None:
        print ("Full Turn Off...")
        for x in range(0, numLights):
            self.relay.off(x)