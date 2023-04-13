import socketio

HOST_ADDRESS = 'http://localhost:5000'
#HOST_HEROKU = 'https://supersynth.herokuapp.com'
# Socket handler. Implement all event methods here. 
class AppSocket(socketio.AsyncClientNamespace):
    async def on_connect(self):
        print("Socket connected")

    async def on_disconnect(self):
        print("Socket disconnected")
        pass

    async def on_time(self, data):
        pass
    
    async def on_event_sequencer_payload(self, data):
        #self.callback(data)
        pass
    
    async def on_event_full_payload(self, data):
        #self.callback(data)
        pass
        

    async def on_event_piano_notes(self, data):
        self.callback(data)

    def registerCallback(self, cbk):
        self.callback = cbk

class SocketClient:
    def __init__(self, onSocketData):
        self.sio = socketio.AsyncClient()

        # Instantiate socket class and register 
        appSocket = AppSocket('/app')
        appSocket.registerCallback(onSocketData)

        self.sio.register_namespace(appSocket)

    async def startServer(self):
        await self.sio.connect(HOST_ADDRESS, namespaces=['/app'])
        await self.sio.wait()


