import socketio

# Socket handler. Implement all event methods here. 
class PiSocket(socketio.AsyncClientNamespace):
    async def on_connect(self):
        print("Socket connected")

    async def on_disconnect(self):
        print("Socket disconnected")
        pass

    async def on_time(self, data):
        # pass
        print("Socket data: " + data)
    
    async def on_wavedata(self, data):
        # pass
        print("Wave data: ")
        print(data)

class SocketClient:
    def __init__(self):
        self.sio = socketio.AsyncClient()
        self.sio.register_namespace(PiSocket('/pi'))

    async def startServer(self):
        await self.sio.connect('http://localhost:5000', namespaces=['/pi'])
        await self.sio.wait()

  # await self.emit('my_response', data)
 


