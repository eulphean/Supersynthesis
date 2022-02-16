# Author: Amay Kataria
# Date: 02/15/2022
# File: main.py
# Description: Entry level python file that spawns co-routines for handling
# incoming OSC data and websocket data and change the behavior of the lights. 
from socketclient import SocketClient
from oscclient import OSCClient
import asyncio

def myfunction(address, args):
    print("calback")
    print(address + args)

async def update():
    while True:

        # Give back the control to asyncio to process queued events. 
        await asyncio.sleep(0)

# Initialize everything here. 
async def main():
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

socketClient = SocketClient()
oscClient = OSCClient(myfunction)
asyncio.run(main())