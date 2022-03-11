from pythonosc.osc_server import AsyncIOOSCUDPServer
from pythonosc.dispatcher import Dispatcher

# Ip Address of the host (for OSC). 
HOST_WINDOWS = "192.168.0.11"
HOST_PI = "172.16.100.38"
HOST_PORT = 8000

class OSCClient: 
    def __init__(self, state, callback): 
        self.dispatcher = Dispatcher()
        self.debugState = state
        # Main interface functions. 
        self.dispatcher.map("/push0", callback) # supersynthesis
        self.dispatcher.map("/push1", callback) # supersynth
        self.dispatcher.map("/push2", callback) # autoscore
        self.dispatcher.map("/push3", callback) # shm
        self.dispatcher.map("/supersynth*", callback) # All supersynth signals.
        self.dispatcher.map("/pd*", callback) # All pureData signals.
        # Simple Harmonic Motion
        self.dispatcher.map("/shm*", callback) # All SHM signals. 
        # Autoscore
        self.dispatcher.map("/autoscore*", callback) # All autoscore signals. 
        self.dispatcher.map("/dark", callback) # All autoscore signals. 


    async def setupServer(self, eventLoop):
        print('setup server')
        hostIp = ''
        if (self.debugState):
            hostIp = HOST_WINDOWS
        else:
            hostIp = HOST_PI

        print(hostIp)
        server = AsyncIOOSCUDPServer((hostIp, HOST_PORT), self.dispatcher, eventLoop)
        await server.create_serve_endpoint()  # Create datagram endpoint and start serving