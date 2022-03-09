# Author: Amay Kataria
# Date: 02/25/2022
# File: autoscore.py
# Description: Class to manage the automatic scoring on the lights. The score is composed of 4 sections currently
# sectionA, sectionB, sectionC, sectionD.
from time import time
from enum import Enum
from score.sectionA import SectionA
from score.sectionB import SectionB
from score.sectionC import SectionC
from score.sectionD import SectionD

# WE SHOULD BE ABLE TO MODIFY THESE TIMES>!!! 
# These times are in seconds. 
SectionA_Time = 30
SectionB_Time = 30
SectionC_Time = 30
SectionD_Time = 30

TIME_CONSTANT = 60

class Section(Enum):
    A = 1
    B = 2
    C = 3
    D = 4

class Autoscore: 
    def __init__(self, relay) -> None:
        # Initializes the section.
        self.sectionA = SectionA(relay)
        self.sectionATime = SectionA_Time

        self.sectionB = SectionB(relay)
        self.sectionBTime = SectionB_Time

        self.sectionC = SectionC(relay)
        self.sectionCTime = SectionC_Time

        self.sectionD = SectionD(relay)
        self.sectionDTime = SectionD_Time

    def begin(self): 
        print('*************MODE:Autoscore*************')
        # Capture start time. 
        self.curTime = time() 
        self.curSection = Section.A
        self.sectionA.begin()
        print("Beginning SectionA...")

    def update(self) -> None:
        elapsedTime = time() - self.curTime

        # State transition logic.
        if (elapsedTime > self.sectionATime and self.curSection == Section.A):
            print("Beginning SectionB...")
            self.curSection = Section.B            
            self.sectionB.begin()
            self.curTime = time()
        elif (elapsedTime > self.sectionBTime and self.curSection == Section.B):
            print("Beginning SectionC...")
            self.curSection = Section.C
            self.sectionC.begin()
            self.curTime = time()
        elif (elapsedTime > self.sectionCTime and self.curSection == Section.C):
            print("Beginning SectionD...")
            self.curSection = Section.D
            self.sectionD.begin()
            self.curTime = time()
        elif (elapsedTime > self.sectionDTime and self.curSection == Section.D):
            print("Beginning SectionA...")
            self.curSection = Section.A
            self.sectionA.begin()
            self.curTime = time()
        
        # Update SectionA
        if (self.curSection == Section.A):
            self.sectionA.update()

        # Update SectionB
        if (self.curSection == Section.B):
            self.sectionB.update()
        
        # Update SectionC
        if (self.curSection == Section.C):
            self.sectionC.update()

        # Update SectionD 
        if (self.curSection == Section.D):
            self.sectionD.update()
    
    def processOsc(self, address, args) -> None:
        if ('timeA' in address):
            self.sectionATime = args * TIME_CONSTANT
        elif ('timeB' in address):
            self.sectionBTime = args * TIME_CONSTANT
        elif ('timeC' in address):
            self.sectionCTime = args * TIME_CONSTANT
        elif ('timeD' in address):
            self.sectionDTime = args * TIME_CONSTANT
        elif ('sectionA' in address):
            self.sectionA.processOsc(address, args)
        elif ('sectionB' in address):
            self.sectionB.processOsc(address, args)
        elif ('sectionC' in address):
            self.sectionC.processOsc(address, args)
        elif ('sectionD' in address):
            self.sectionD.processOsc(address, args)

    def reset(self) -> None:
        # Take a new snapshot of the current time. 
        self.curTime = time()
