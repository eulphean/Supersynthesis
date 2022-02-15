from time import time
from enum import Enum
from sectionA import SectionA
from sectionB import SectionB
from sectionC import SectionC
from sectionD import SectionD

# Constants. 
Warmup_Time = 2
SectionA_Time = 120
SectionB_Time = 0
SectionC_Time = 0
SectionD_Time = 0
Score_Time = 40

class Section(Enum):
    Empty = 0
    A = 1
    B = 2
    C = 3
    D = 4

class Score: 
    def __init__(self, relay, numLights) -> None:
        # Start with an empty state
        self.curSection = Section(Section.Empty)

        # Initializes the section.
        self.sectionA = SectionA(relay, numLights)
        self.sectionB = SectionB(relay, numLights)
        self.sectionC = SectionC(relay, numLights)
        self.sectionD = SectionD(relay, numLights)

        # Capture start time. 
        self.curTime = time() 

        self.curSection = Section.D
        self.sectionD.begin()

    def update(self) -> None:
        elapsedTime = time() - self.curTime

        

        # State transition logic.
        # if (elapsedTime > Warmup_Time and self.curSection == Section.Empty):
        #     print("Beginning SectionA...")
        #     self.curSection = Section.D
        #     self.sectionA.begin()
        #     self.curTime = time()
        # elif (elapsedTime > SectionA_Time and self.curSection == Section.D):
        #     print("Beginning SectionB...")
        #     self.curSection = Section.B            
        #     self.sectionB.begin()
        #     self.curTime = time()
        # elif (elapsedTime > SectionB_Time and self.curSection == Section.B):
        #     print("Beginning SectionC...")
        #     self.curSection = Section.C
        #     self.sectionC.begin()
        #     self.curTime = time()
        # elif (elapsedTime > SectionC_Time and self.curSection == Section.C):
        #     self.curSection = Section.D
        #     self.sectionA.begin()
        #     self.curTime = time()
        # elif (elapsedTime > SectionD_Time and self.curSection == Section.D):
        #     self.curSection = Section.A
        #     self.sectionD.begin()
        #     self.curTime = time()
        
        # Execute SectionA
        if (self.curSection == Section.A):
            self.sectionA.update()

        # Execute SectionB
        if (self.curSection == Section.B):
            self.sectionB.update()
        
        # Execute SectionC
        if (self.curSection == Section.C):
            self.sectionC.update()

        # Execute SectionD 
        if (self.curSection == Section.D):
            self.sectionD.update()

    def reset(self) -> None:
        # Take a new snapshot of the current time. 
        self.curTime = time()
        # self.sectionA.reset()