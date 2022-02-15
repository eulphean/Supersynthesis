from math import sin, pi
from graphics import *
from time import time

NUM_BULBS = 8
WIN_WIDTH = 800
WIN_HEIGHT = 800
INCREMENT = WIN_WIDTH / NUM_BULBS
SLOW_FACTOR = 0.5
MAX_AMP = 50

class Bulb:
    def __init__(self, x, y, angle, win):
        self.pos = [x, y]
        self.prevX = self.pos[0] # Keep track of previous position.
        self.color = "red"
        self.angle = angle
        self.bulb = Circle(Point(self.pos[0], self.pos[1]), 10)
        self.bulb.setFill(self.color)
        self.bulb.draw(win)

    def mapRange(self, value, inMin, inMax, outMin, outMax):
        return outMin + (((value - inMin) / (inMax - inMin)) * (outMax - outMin))

    def checkIntersection(self, cPoint):
        checkPointPos = WIN_WIDTH/2
        if (self.pos[0] > checkPointPos and self.prevX < checkPointPos):
            # do something
            # self.bulb.setFill("white")
            self.bulb.undraw()
        elif (self.pos[0] < checkPointPos and self.prevX > checkPointPos):
            # self.bulb.setFill("white")
            self.bulb.undraw()
        else:
            self.bulb.setFill(self.color)

    def move(self, cPoint, idx):
        # Update the position. 
        xPos = sin(self.angle * SLOW_FACTOR * time())
        xPos = self.mapRange(xPos, -1, 1, WIN_WIDTH/2 - MAX_AMP, WIN_WIDTH/2 + MAX_AMP)
        
        dx = xPos - self.pos[0]
        self.pos[0] = xPos

        # Check if we are intersecting with the cPoints.
        self.checkIntersection(cPoint)
        
        self.bulb.move(dx, 0)

        self.prevX = self.pos[0]

class CPoint:
    def __init__(self, x, y, angle, win):
        self.pos = [x, y]
        self.color = "green"
        self.angle = angle
        self.angle = self.mapRange(self.angle, 0, NUM_BULBS, 0, 2 * pi)
        self.pos[0] = self.mapRange(sin(self.angle), -1, 1, WIN_WIDTH/2 - 50, WIN_WIDTH/2 + 50)
        self.bulb = Circle(Point(self.pos[0], self.pos[1]), 5)
        self.bulb.setFill(self.color)
        self.bulb.draw(win)
    
    def mapRange(self, value, inMin, inMax, outMin, outMax):
        return outMin + (((value - inMin) / (inMax - inMin)) * (outMax - outMin))


def setupBulbs(bulbs, win):
    for i in range(0, NUM_BULBS):
        y = 10 + i * INCREMENT
        b = Bulb(WIN_HEIGHT/2, y, i+1, win)
        bulbs.append(b)

def setupPoints(cPoints, win):
    for i in range(0, NUM_BULBS):
        y = 10 + i * INCREMENT
        b = CPoint(WIN_HEIGHT/2, y, i+1, win)
        cPoints.append(b)

def main():
    win = GraphWin("SHM", WIN_WIDTH, WIN_HEIGHT)
    bulbs = []
    cPoints = []
    setupBulbs(bulbs, win)
    setupPoints(cPoints, win)

    # Draw bulbs continuously
    while win.checkMouse() == None:
        idx = 0
        for b in bulbs:
            cPoint = cPoints[idx]
            b.move(cPoint, idx) 
            idx += 1
main()