from pythonosc.osc_server import AsyncIOOSCUDPServer
from pythonosc.dispatcher import Dispatcher

# Ip Address of the host (for OSC). 
HOST_IP = "192.168.0.11"
HOST_PORT = 8000

class OSCClient: 
    def __init__(self, callback): 
        self.dispatcher = Dispatcher()
        # Main interface functions. 
        self.dispatcher.map("/push0", callback) # supersynthesis
        self.dispatcher.map("/push1", callback) # supersynth
        self.dispatcher.map("/push2", callback) # autoscore
        self.dispatcher.map("/push3", callback) # shm
        self.dispatcher.map("/supersynth*", callback)


    async def setupServer(self, eventLoop):
        server = AsyncIOOSCUDPServer((HOST_IP, HOST_PORT), self.dispatcher, eventLoop)
        await server.create_serve_endpoint()  # Create datagram endpoint and start serving

    def processSignal(self, address, args):
        self.callback(address, args)
        print(address + ', ' + str(args))
        s = address.split('/')
        lightIdx = int(s[2])
        message = '0 ' + str(lightIdx) + ' ' + str(args) + ';'