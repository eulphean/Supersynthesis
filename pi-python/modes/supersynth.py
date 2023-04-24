# Author: Amay Kataria
# Date: 02/24/2022
# File: supersynth.py
# Description: Handles the supersynth mode that controls individual lights. Either for performance
# or for testing the installation. 
from modes.common import Common

class Supersynth(Common):
    def __init__(self, relay): 
        super().__init__(relay)
    
    def begin(self):
        print('*************MODE:Supersynth*************')
        # Turn off all the lights if they are not already off. 
        self.fullTurnOff()
    
    def updateLights(self, address, args):
        # Extra note and row number. 
        s = address.split('/')
        noteNum = int(s[3])
        rowNum = int(s[2])

        # Calculate light index
        lightIdx = 0
        if (rowNum == 1):
            lightIdx = int(noteNum) - 1
        elif (rowNum == 2):
            lightIdx = 8 + int(noteNum) - 1
        else:
            lightIdx = 16 + int(noteNum) -1

        if (args == 1):
            self.switchOn(lightIdx)
        
        if (args == 0):
            self.switchOff(lightIdx)