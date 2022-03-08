# Author: Amay Kataria
# Date: 02/22/2022
# File: supersynthesis.py
# Description: The mode that is controlled by the website (supersynthesis.art).

from modes.common import Common
import time

class Supersynthesis(Common):
    def __init__(self, relay): 
        super().__init__(relay)
    
    def begin(self):
        print('*************MODE:Supersynthesis*************')
        self.fullTurnOff()
    
    def updateLights(self, state):
        if (state == 'NONE'):
            # A pattern has finished, turn off all the lights. 
            # Turn off all of them in a direction. 
            self.fullTurnOff()    
            return
        else:
            # Get the last element from the light list.
            # Get its index and value and execute it. 
            states = state.pop()
            for s in states:
                idx = s['idx']
                val = s['val']
                if (val == 1):
                    self.switchOn(idx)

    def resetLights(self):
        self.lightsOn(0, self.numLights)    
        time.sleep(0.35)
        self.lightsOff(0, self.numLights)