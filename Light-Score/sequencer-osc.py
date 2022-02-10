from pythonosc.osc_server import AsyncIOOSCUDPServer
from pythonosc.dispatcher import Dispatcher
import asyncio
import os
from score import Score
from relay import Relay
from shm import SHM

# Ip Address of the host (for OSC). 
HOST_IP = "192.168.0.11"
HOST_PORT = 8000

# Total lights. 
NUM_LIGHTS = 24

# Global signals
g_Play = True
g_Reset = False

def send2pd(message=''):
    # Send a message to PD
    os.system("echo '" + message + "' | pdsend 3000")

def processSignal(address, args):
    global g_Play, g_Reset

    # Mapping play to play / pause for now.
    if ("play" in address):
        g_Play = True
        message = '0 1;'
        send2pd(message)
    
    # Mapping pause to reset for now. 
    if ("pause" in address):
        g_Play = False
        g_Reset = True
        message = '0 0;'
        send2pd(message)
    
    if ("tempo" in address):
        vol = args
        message = '1 ' + str(vol) + ';' # make a string for use with pdsend
        send2pd(message)

# Main loop that will run in parallel to the OSC server endpoint.
async def main_loop():
    g_Reset = False

    # Setup relays. 
    
    #relay = Relay()

    # Setup score.
    #score = Score(relay, NUM_LIGHTS)
    shm = SHM(NUM_LIGHTS)
    while True:
        shm.update()
        # # Update score.
        # if (g_Play == True):
        #     score.update()
        
        # # Reset score.
        # if (g_Reset == True):
        #     score.reset()
        #     g_Reset = False

        # Give control to OSC.  
        await asyncio.sleep(0)

async def init_main():
    # Setup dispatcher.
    dispatcher = Dispatcher()
    dispatcher.map("/play", processSignal)
    dispatcher.map("/pause", processSignal)
    dispatcher.map("/tempo", processSignal)

    # Get the event loop and pass it to the server. This event loop will handle all osc requests. 
    osc_event_loop = asyncio.get_event_loop()
    server = AsyncIOOSCUDPServer((HOST_IP, HOST_PORT), dispatcher, osc_event_loop)
    transport = await server.create_serve_endpoint()  # Create datagram endpoint and start serving
    await main_loop()  # Enter main loop of program
    transport.close()  # Clean up serve endpoint

# Initialize the program.
asyncio.run(init_main())