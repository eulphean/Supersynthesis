# osc module
import argparse
from pythonosc import dispatcher
from pythonosc import osc_server
import asyncio

class Osc: 
    def __init__(self, ip, port, processSignal) -> None:
        # Map the incoming OSC signals to the callback functions. 
        d = dispatcher.Dispatcher()
        d.map("/play", processSignal)
        d.map("/pause", processSignal)
        d.map("/tempo", processSignal)

        asyncio.run(self.initServer(ip, port, d))
    
    async def initServer(self, ip, port, disp): 
         # Start the OSC server. 
        server = osc_server.AsyncIOOSCUDPServer((ip, port), disp, asyncio.get_event_loop())
   
    
