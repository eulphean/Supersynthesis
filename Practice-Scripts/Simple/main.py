# Simple relay program in Python.
from tube import Tube
import time

def initTubes(num_tubes, collection):
    for x in range(num_tubes):
        t = Tube(x)
        collection.append(t)

def pattern(tubes):
    cur_time = time.time()
    while True:
        for t in tubes:
            t.on()
            time.sleep(0.5)
            t.off()
        
        for t in reversed(tubes):
            t.on()
            time.sleep(0.5)
            t.off()

# App entry point.
def main():
    # Tube collection
    tubes = []

    # Initialize tubes
    initTubes(4, tubes)

    # Run a pattern on the tubes
    pattern(tubes)
  
if __name__ == '__main__':
    main()