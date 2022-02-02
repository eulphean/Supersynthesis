# Simple relay program in Python.
import gpiozero as gpio
import time
import random

# Relays declaration.
relayA = gpio.LED("14")
relayB = gpio.LED("15")
cur_time = time.time()
track_A = False

def getRandom():
	rand = random.randint(1, 10)
	return rand
	
# Infinite loop do things (like Arduino)
def loop():
	global cur_time
	global track_A

	while True:
		elapsed_time = time.time() - cur_time
		if elapsed_time > 0.1 and track_A is False:
			rand = getRandom()
			if rand < 5: relayA.on()
			else: relayA.off()
			track_A = True

		if elapsed_time > 0.2:
			rand = getRandom()
			if rand < 5: relayB.on()
			else: relayB.off()
			track_A = False
			# Reset time. 
			cur_time = time.time()

# App entry point.
def main():
	loop()

if __name__ == '__main__':
    main()
