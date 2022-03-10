# Relay module to setup things on it.
# from gpiozero import LED
# from gpiozero.pins.pigpio import PiGPIOFactory
from pd import PD

class Relay:
    def __init__(self, debug = True) -> None:
        self.debug = debug
        # Control the GPIO pins from the windows machine.
        # factory = PiGPIOFactory(host='192.168.0.10')
        # self.initPins(factory)
        self.pd = PD()

    def on(self, idx) -> None:
        if (self.debug):
            print("On, idx: " + str(idx))
            # led = self.relay[idx]
            # # Flipped by design.
            # led.on()
            message = '0 ' + str(idx) + ' ' + str(1) + ';'
            self.pd.send2pd(message)
        else:
            pass

    def off(self, idx) -> None:
        if (self.debug):
            print("Off, idx: " + str(idx))
            # led = self.relay[idx]
            # # Flipped by design.
            # led.off()
            message = '0 ' + str(idx) + ' ' + str(0) + ';'
            self.pd.send2pd(message)
        else:
            pass

    def initPins(self, factory) -> None:
        # Assign all the pins to the realy. 
        self.relayOnePins = [7, 8, 25, 24, 23, 18, 15, 14]
        self.relayTwoPins = [21, 20, 16, 12, 1, 26, 19, 13]
        self.relayThreePins= [27, 22, 10, 9, 11, 0, 5, 6]

        # Store the initialized pin objects. 
        self.relayOne = []
        self.relayTwo = []
        self.relayThree = []
        self.relay = []

        # # Set the pins
        # for x in self.relayOnePins:
        #     print(x)
        #     led = LED(x, pin_factory=factory)
        #     self.relay.append(led)
        
        # for x in self.relayTwoPins:
        #     print(x)
        #     led = LED(x, pin_factory=factory)
        #     self.relay.append(led)

        # for x in self.relayThreePins:
        #     print(x)
        #     led = LED(x, pin_factory=factory)
        #     self.relay.append(led)

            





