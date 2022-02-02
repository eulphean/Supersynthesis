"""Small example OSC server

This program listens to several addresses, and prints some information about
received packets.
"""
import argparse
import math

from pythonosc import dispatcher
from pythonosc import osc_server

# Process the signals and take action.
def processSignal(address, value, type):
  print(type)
  print(value)

if __name__ == "__main__":
  parser = argparse.ArgumentParser()
  # Add the ip address of the host where these signals are sent. 
  # Add this ip address to the OSC app. 
  parser.add_argument("--ip", default="192.168.0.11", help="The ip to listen on")
  # Add the port from the OSC app where this signal is sent. 
  parser.add_argument("--port", type=int, default=8000, help="The port to listen on")
  args = parser.parse_args()

  # Map the incoming OSC signals to the callback functions. 
  dispatcher = dispatcher.Dispatcher()
  dispatcher.map("/play", processSignal, "play")
  dispatcher.map("/pause", processSignal, "pause")
  dispatcher.map("/tempo", processSignal, "tempo")

  # Start the OSC server. 
  server = osc_server.ThreadingOSCUDPServer((args.ip, args.port), dispatcher)
  print("Serving on {}".format(server.server_address))
  server.serve_forever()