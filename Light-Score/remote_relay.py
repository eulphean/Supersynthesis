from gpiozero import LED
from gpiozero.pins.pigpio import PiGPIOFactory

from time import sleep
factory = PiGPIOFactory(host='192.168.0.10')
led = LED(8, pin_factory=factory)
while True:
    print("Hello On")
    led.on()
    sleep(5)
    print("Hello Off")
    led.off()
    sleep(5)
