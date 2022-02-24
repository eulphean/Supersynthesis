import socketio

HOST_ADDRESS = 'http://localhost:5000'
# HOST_HEROKU = 'https://supersynth.herokuapp.com'
# Socket handler. Implement all event methods here. 
class AppSocket(socketio.AsyncClientNamespace):
    def setCallback(self, cbk):
        self.callback = cbk
        print('set')

    async def on_connect(self):
        print("Socket connected")

    async def on_disconnect(self):
        print("Socket disconnected")
        pass

    async def on_time(self, data):
        pass
        #print("Socket data: " + data)
    
    async def on_wavedata(self, data):
        # pass
        print("Wave data: ")
        self.callback(data)
    
    async def on_lightdata(self, data):
        print('New Data')
        # pass
        self.callback(data)

    async def on_testdata(self, data):
        # pass
        self.callback(data)

class SocketClient:
    def __init__(self, onSocketData):
        self.sio = socketio.AsyncClient()
        appSocket = AppSocket('/app')
        appSocket.setCallback(onSocketData)
        self.sio.register_namespace(appSocket)

    async def startServer(self):
        await self.sio.connect(HOST_ADDRESS, namespaces=['/app'])
        await self.sio.wait()


