from pythonosc.osc_server import AsyncIOOSCUDPServer
from pythonosc.dispatcher import Dispatcher
import asyncio

def filter_handler(address, args):
    print(args)

dispatcher = Dispatcher()
dispatcher.map("/play", filter_handler)

ip = "192.168.0.11"
port = 8000


async def loop():
    """Example main loop that only runs for 10 iterations before finishing"""
    while True:
        await asyncio.sleep(0)


async def init_main():
    server = AsyncIOOSCUDPServer((ip, port), dispatcher, asyncio.get_event_loop())
    transport = await server.create_serve_endpoint()  # Create datagram endpoint and start serving

    await loop()  # Enter main loop of program

    transport.close()  # Clean up serve endpoint


asyncio.run(init_main())