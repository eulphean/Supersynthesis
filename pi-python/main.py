# Author: Amay Kataria
# Date: 02/15/2022
# File: main.py
# Description: Entry level python file that spawns co-routines for handling
# incoming OSC data and websocket data and change the behavior of the lights. 
from comms.socketclient import SocketClient
from comms.oscclient import OSCClient
import asyncio
import sys
from lightsManager import LightsManager

def myfunction(address, args):
    print("calback")
    print(address + args)

def onSocketData(data):
    lightsManager.updateLightData(data)

async def update():
    while True:
        # Keep updating the lights from here. 
        lightsManager.update()
        # Give back the control to asyncio to process queued events. 
        await asyncio.sleep(0)

# Initialize everything here. 
async def main():
    # Setup relay
    loop = asyncio.get_event_loop()
    t1 = loop.create_task(socketClient.startServer())
    t2 = loop.create_task(oscClient.setupServer(loop))
    t3 = loop.create_task(update())    
    try:
        await t1
        await t2
        await t3
    except asyncio.CancelledError:
        t1.cancel()
        t2.cancel()
        t3.cancel()
        print("All pending tasks cancelled")


# Get the first argument. If it's debug,
# we are doing this from Windows machine. 
# Pass any other string if on a raspberry pi. 
state = sys.argv[1]
state = state == 'debug'
lightsManager = LightsManager(state)
socketClient = SocketClient(onSocketData)
oscClient = OSCClient(myfunction)
asyncio.run(main())