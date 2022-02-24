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
SectionA_Time = 15
SectionB_Time = 15
SectionC_Time = 15
SectionD_Time = 15

class Section(Enum):
    A = 1
    B = 2
    C = 3
    D = 4

class Autoscore: 
    def __init__(self, relay) -> None:
        # Initializes the section.
        self.sectionA = SectionA(relay)
        self.sectionB = SectionB(relay)
        self.sectionC = SectionC(relay)
        self.sectionD = SectionD(relay)

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
        if (elapsedTime > SectionA_Time and self.curSection == Section.A):
            print("Beginning SectionB...")
            self.curSection = Section.B            
            self.sectionB.begin()
            self.curTime = time()
        elif (elapsedTime > SectionB_Time and self.curSection == Section.B):
            print("Beginning SectionC...")
            self.curSection = Section.C
            self.sectionC.begin()
            self.curTime = time()
        elif (elapsedTime > SectionC_Time and self.curSection == Section.C):
            print("Beginning SectionD...")
            self.curSection = Section.D
            self.sectionD.begin()
            self.curTime = time()
        elif (elapsedTime > SectionD_Time and self.curSection == Section.D):
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

    def reset(self) -> None:
        # Take a new snapshot of the current time. 
        self.curTime = time()
