from time import time
from enum import Enum
from sectionA import SectionA
from sectionB import SectionB
from sectionC import SectionC

# Constants. 
Warmup_Time = 2
SectionA_Time = 10
SectionB_Time = 10
SectionC_Time = 10
Score_Time = 30

# Number of lights.
Num_Lights = 8

class Section(Enum):
    Empty = 0
    A = 1
    B = 2
    C = 3

class Score: 
    def __init__(self, relay) -> None:
        # Start with an empty state
        self.curSection = Section(Section.Empty)

        # Initializes the section.
        self.sectionA = SectionA(relay, Num_Lights)
        self.sectionB = SectionB(relay, Num_Lights)
        self.sectionC = SectionC(relay, Num_Lights)

        # Capture start time. 
        self.curTime = time() 

    def update(self) -> None:
        elapsedTime = time() - self.curTime

        # State transition logic.
        if (elapsedTime > Warmup_Time and self.curSection == Section.Empty):
            print("Beginning SectionA...")
            self.curSection = Section.A
            self.sectionA.begin()
            self.curTime = time()
        elif (elapsedTime > SectionA_Time and self.curSection == Section.A):
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
            self.curSection = Section.A
            self.sectionA.begin()
            self.curTime = time()
        
        # Execute SectionA
        if (self.curSection == Section.A):
            self.sectionA.update()

        # Execute SectionB
        if (self.curSection == Section.B):
            self.sectionB.update()
        
        # Execute SectionC
        if (self.curSection == Section.C):
            self.sectionC.update()

    def reset(self) -> None:
        # Take a new snapshot of the current time. 
        self.curTime = time()
        self.sectionA.reset()