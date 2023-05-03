# Author: Amay Kataria
# Date: 02/22/2022
# File: supersynthesis.py
# Description: When this mode is active, everything that is happening on the Webapp is forwarded to the 
# raspberry pi cleanly. This file here should do all the work processing it.

from modes.common import Common
import time

class Supersynthesis(Common):
    def __init__(self, relay): 
        super().__init__(relay)
    
    def begin(self):
        print('*************MODE:Supersynthesis*************')
        self.fullTurnOff()
    
    def updateLights(self, state):
        #print(state);
        if (state == 'NONE'):
            # A pattern has finished, turn off all the lights. 
            # Turn off all of them in a direction. 
            self.fullTurnOff()    
            return
        else:
            # Get the last element from the light list.
            # Get its index and value and execute it. 
            # print(state)
            states = state.pop()
            print(states)
            for s in states:
                idx = s['idx']
                val = s['val']
                if (val == 1):
                    self.switchOn(idx)
    
    def synthNotes(self, synthData):
        for i in range(0, 24):
            val = synthData[i]['val']
            if (val == 1):
                self.switchOn(i)
            else:
                self.switchOff(i)

    def resetLights(self):
        self.lightsOn(0, self.numLights)    
        time.sleep(0.35)
        self.lightsOff(0, self.numLights)
