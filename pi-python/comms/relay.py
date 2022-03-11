# Author: Amay Kataria
# Date: 02/22/2022
# File: relay.py
# Description: Class that controls all the interaction with the relays on the raspberry pi.
from gpiozero import LED
from gpiozero.pins.pigpio import PiGPIOFactory
from comms.pd import send2pd

# IP Address of the raspberry pi. 
RASPI_IP = '192.168.0.10'

class Relay:
    def __init__(self, debug = False) -> None:
        # Relay pins. 
        self.relayOnePins = [7, 8, 25, 24, 23, 18, 15, 14]
        self.relayTwoPins = [21, 20, 16, 12, 1, 26, 19, 13]
        self.relayThreePins= [27, 22, 10, 9, 11, 0, 5, 6]
        self.relay = []
        self.isDark = False

        #Control the GPIO pins from the windows machine.
        if (debug):
            factory = PiGPIOFactory(host=RASPI_IP)
            self.initDebugPins(factory)
        else:
            # Run with raspberry pi.
            self.initPins()

    def on(self, idx, sound) -> None:
        if (self.isDark == False):
            print("On, idx: " + str(idx))
            led = self.relay[idx]
            # # Flipped by design.
            led.on()

        # Play a sound only if I want to it to be on.
        if (sound):
            # Pure data message. 
            message = '0 ' + str(idx) + ' ' + str(1) + ';'
            send2pd(message)

    def off(self, idx) -> None:
        if (self.isDark == False):
            print("Off, idx: " + str(idx))
            led = self.relay[idx]
            # Flipped by design.
            led.off()

        # Pure data message. 
        message = '0 ' + str(idx) + ' ' + str(0) + ';'
        send2pd(message)

    def initPins(self):
        pass
        # Set the pins
        for x in self.relayOnePins:
            print(x)
            led = LED(x)
            self.relay.append(led)
        
        for x in self.relayTwoPins:
            print(x)
            led = LED(x)
            self.relay.append(led)

        for x in self.relayThreePins:
            print(x)
            led = LED(x)
            self.relay.append(led)


    def initDebugPins(self, factory):
        pass
        # # Set the pins
        for x in self.relayOnePins:
            print(x)
            led = LED(x, pin_factory=factory)
            self.relay.append(led)
        
        for x in self.relayTwoPins:
            print(x)
            led = LED(x, pin_factory=factory)
            self.relay.append(led)

        for x in self.relayThreePins:
            print(x)
            led = LED(x, pin_factory=factory)
            self.relay.append(led)

            





