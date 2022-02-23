# Author: Amay Kataria
# Date: 02/22/2022
# File: manager.py
# Description: Central lights manager that manages what state we are in. 
from modes.supersynthesis import Supersynthesis
from comms.relay import Relay

NUM_LIGHTS = 24

class LightsManager: 
    def __init__(self, debugState)->None: 
        # Initialize the relay. 
        self.relay = Relay(debugState)
        self.supersynthesis = Supersynthesis(self.relay, NUM_LIGHTS)
        # We need to keep track of what mode we are in. 
        # This should be called on a mode switch.
        self.supersynthesis.begin()

    def update(self):
        self.supersynthesis.update()

    def updateLightData(self, data)->None: 
        #test data
        self.supersynthesis.updateTestData(data['idx'], data['val'])

        # Wave data
        # onTime = self.getTimeFromBpm(data['bpm'])
        # topLights, bottomLights = self.getLightArraysFromData(data['lights'])
        # self.supersynthesis.updateLightData(onTime, topLights, bottomLights)
    
    def getLightArraysFromData(self, lightData):
        topLights = []
        bottomLights = []
        for d in lightData:
            topLights.append(d['TOP'])
            bottomLights.append(d['BOTTOM'])
        return topLights, bottomLights

    def getTimeFromBpm(self, bpm):
        return 60000 / bpm

