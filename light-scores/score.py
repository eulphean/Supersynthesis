from time import time
from sectionA import SectionA
from sectionB import SectionB
from sectionC import SectionC

# Constants. 
SectionA_Time = 5
SectionB_Time = 10
SectionC_Time = 10
Score_Time = 30

class Score: 
    def __init__(self, relay) -> None:
        # Start time.
        self.start_time = time() 

        # These sections are causing an issue.
        # They can be initialized in the beginning but they need to 
        # be setup once the time is ending for the current score.
        # I need to build that architecture in the score. 
        # Setup sectionA.
        # self.sectionA = SectionA(relay)
        # # Setup sectionB.
        # self.sectionB = SectionB(relay)
        # # Setup sectionC.
        self.sectionC = SectionC(relay)

    def update(self) -> None:
        elapsedTime = time() - self.start_time

        # How do I clean up the tubes???
        # Are we still in current section? 
        if (elapsedTime <= SectionC_Time):
            self.sectionC.update()

        elif (elapsedTime <= (SectionA_Time + SectionB_Time)):
            self.sectionB.update()

        elif (elapsedTime <= Score_Time):
            print("SectionC")            
            # Go to the next section.

    def reset(self) -> None:
        # Take a new snapshot of the current time. 
        self.start_time = time()
        self.sectionA.reset()
