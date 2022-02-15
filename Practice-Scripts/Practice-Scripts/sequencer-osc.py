from pythonosc.osc_server import AsyncIOOSCUDPServer
from pythonosc.dispatcher import Dispatcher
import asyncio
import time
import os

# Ip Address of the host. 
ip = "192.168.0.11"
port = 8000
play = True
reset = False

def send2pd(message=''):
    # Send a message to PD
    os.system("echo '" + message + "' | pdsend 3000")

def processSignal(address, args):
    global play, reset

    # Mapping play to play / pause for now.
    if ("play" in address):
        play = True
        message = '0 1;'
        send2pd(message)
    
    # Mapping pause to reset for now. 
    if ("pause" in address):
        play = False
        reset = True
        message = '0 0;'
        send2pd(message)
    
    if ("tempo" in address):
        vol = args
        message = '1 ' + str(vol) + ';' # make a string for use with pdsend
        send2pd(message)

# Main loop that will run in parallel to the OSC server endpoint.
async def main_loop():
    global reset 
    idx = 0
    cur_time = time.time()
    max = 8
    while True:
        if (play == True):
            # Do something in here. 
            elapsedTime = time.time() - cur_time; 
            if (elapsedTime > 0.1):
                print(idx)
                idx += 1
                cur_time = time.time()
                if (idx == max):
                    idx = 0  
        
        if (reset == True):
            idx = 0
            cur_time = time.time()
            reset = False

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
    server = AsyncIOOSCUDPServer((ip, port), dispatcher, osc_event_loop)
    transport = await server.create_serve_endpoint()  # Create datagram endpoint and start serving
    await main_loop()  # Enter main loop of program
    transport.close()  # Clean up serve endpoint

# Initialize the program.
asyncio.run(init_main())