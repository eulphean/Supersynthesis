from math import sin, pi
from time import time

NUM_BULBS = 24
WIN_WIDTH = 800
WIN_HEIGHT = 800
CENTER = WIN_WIDTH/2
MAX_AMP = 100
INCREMENT = WIN_WIDTH / NUM_BULBS
SLOW_FACTOR = 0.25

def mapRange(value, inMin, inMax, outMin, outMax):
    return outMin + (((value - inMin) / (inMax - inMin)) * (outMax - outMin))

class Bulb:
    def __init__(self, x, y, angle):
        self.pos = [x, y]
        self.prevX = self.pos[0] # Keep track of previous position.
        self.angle = angle
        self.lightOn = False

    def mapRange(self, value, inMin, inMax, outMin, outMax):
        return outMin + (((value - inMin) / (inMax - inMin)) * (outMax - outMin))

    def checkIntersection(self, cPoint, idx):
        # checkPointPos = cPoint.pos[0]
        checkPointPos = CENTER
        if (self.pos[0] > checkPointPos and self.prevX < checkPointPos and self.lightOn == False):
            # do something
            print("*****************************Light On:" + str(idx))
            self.lightOn = True
        elif (self.pos[0] < checkPointPos and self.prevX > checkPointPos and self.lightOn == False):
            print("*****************************Light On:" + str(idx))
            self.lightOn = True
        else:
            # print("Light Off")
            if (self.lightOn):
                self.lightOn = False
                print("********************************Light Off:" + str(idx))
            pass

    def update(self, cPoint, idx):
        # Update the position. 
        xPos = sin(self.angle * SLOW_FACTOR * time())
        xPos = mapRange(xPos, -1, 1, WIN_WIDTH/2 - MAX_AMP, WIN_WIDTH/2 + MAX_AMP)
        self.pos[0] = xPos

        # Check if we are intersecting with the cPoints.
        self.checkIntersection(cPoint, idx)
        
        # Store previous value. 
        self.prevX = self.pos[0]

class CPoint:
    def __init__(self, x, y, angle):
        self.pos = [x, y]
        self.angle = angle
        self.angle = mapRange(self.angle, 0, NUM_BULBS, 0, 2 * pi)
        self.pos[0] = mapRange(sin(self.angle), -1, 1, WIN_WIDTH/2 - 50, WIN_WIDTH/2 + 50)
    

def setupBulbs(bulbs):
    for i in range(0, NUM_BULBS):
        y = 10 + i * INCREMENT
        b = Bulb(WIN_HEIGHT/2, y, i+1)
        bulbs.append(b)

def setupPoints(cPoints):
    for i in range(0, NUM_BULBS):
        y = 10 + i * INCREMENT
        b = CPoint(WIN_HEIGHT/2, y, i+1)
        cPoints.append(b)

def main():
    bulbs = []
    cPoints = []
    setupBulbs(bulbs)
    setupPoints(cPoints)

    # Draw bulbs continuously
    while True:
        idx = 0
        log = ""
        for b in bulbs:
            cPoint = cPoints[idx]
            log += str(b.pos[0]) + ","
            b.update(cPoint, idx) 
            idx += 1
        #print(log)

main()