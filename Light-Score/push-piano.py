from pythonosc.osc_server import AsyncIOOSCUDPServer
from pythonosc.dispatcher import Dispatcher
import asyncio

from pd import PD

from relay import Relay
# Ip Address of the host (for OSC). 
HOST_IP = "192.168.0.11"
HOST_PORT = 8000

# Total lights. 
NUM_LIGHTS = 4

# Setup PureData
pd = PD()
# Setup relays. 
relay = Relay()

def processSignal(address, args):
    # /piano/<note_num>/<row_num>
    # Note_Num: 1 - 8
    # Row_Num: 1 - 3
    # args is NoteOn/Off
    print(address + ', ' + str(args))
    s = address.split('/')
    lightIdx = int(s[2])
    message = '0 ' + str(lightIdx) + ' ' + str(args) + ';'
    pd.send2pd(message)
    if (args == 1.0):
        relay.on(lightIdx)
    elif (args == 0.0):
        relay.off(lightIdx)

    # # Calculate light index
    # lightIdx = 0
    # if (rowNum == 1):
    #     lightIdx = int(noteNum) - 1
    # elif (rowNum == 2):
    #     lightIdx = 8 + int(noteNum) - 1
    # else:
    #     lightIdx = 16 + int(noteNum) -1

    # message = '0 ' + str(lightIdx) + ' ' + str(args) + ';'
    # # print(message)

    # pd.send2pd(message)
    # if (args == 1.0):
    #     relay.on(lightIdx)
    # elif (args == 0.0):
    #     relay.off(lightIdx)

def processToggle(address, args):
    if (args == 1.0):
        relay.on(7)
    elif (args == 0.0):
        relay.off(7)


def processMultipush(address, args):
      # /piano/<note_num>/<row_num>
    # Note_Num: 1 - 8
    # Row_Num: 1 - 3
    # args is NoteOn/Off
    print(address + ', ' + str(args))
    s = address.split('/')
    noteNum = int(s[3])
    rowNum = int(s[2])

    # Calculate light index
    lightIdx = 0
    if (rowNum == 1):
        lightIdx = int(noteNum) - 1
    elif (rowNum == 2):
        lightIdx = 8 + int(noteNum) - 1
    else:
        lightIdx = 16 + int(noteNum) -1

    message = '0 ' + str(lightIdx) + ' ' + str(args) + ';'
    # print(message)
    pd.send2pd(message)

    # Relay.
    if (args == 1):
        relay.on(lightIdx)
    elif (args == 0):
        relay.off(lightIdx)

# Main loop that will run in parallel to the OSC server endpoint.
async def main_loop():

    while True:
        # Give control to OSC.  
        await asyncio.sleep(0)

async def init_main():
    # Setup dispatcher.
    dispatcher = Dispatcher()
    dispatcher.map("/push*", processMultipush)
    dispatcher.map("/piano*", processSignal)
    dispatcher.map("/button", processSignal)
    dispatcher.map("/toggle", processToggle)

    # Get the event loop and pass it to the server. This event loop will handle all osc requests. 
    osc_event_loop = asyncio.get_event_loop()
    server = AsyncIOOSCUDPServer((HOST_IP, HOST_PORT), dispatcher, osc_event_loop)
    transport = await server.create_serve_endpoint()  # Create datagram endpoint and start serving
    await main_loop()  # Enter main loop of program
    transport.close()  # Clean up serve endpoint

# Initialize the program.
asyncio.run(init_main())