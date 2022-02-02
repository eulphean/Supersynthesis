# Simple 8 step sequencer.
# Receive OSC to start, reset, pause, or change the tempo of this. 
import time
from osc import Osc

play = True
pause = False

def sequence(num, max, cur_time):
    while True:
        elapsedTime = time.time() - cur_time; 
        if (elapsedTime > 0.1):
            print(num)
            num = num + 1
            cur_time = time.time()
            if (num == max):
                a = 0

def processSignal(addr, value):
    print(addr)
    print (value)

# App entry point
def main():
    osc = Osc("192.168.0.11", 8000, processSignal)
    a = 0
    max_num = 8
    cur_time = time.time()
    sequence(a, max_num, cur_time)

if __name__ == '__main__':
    main()