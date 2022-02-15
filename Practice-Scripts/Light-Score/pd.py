# Simple class to expose modules to send data to PureData
import os
class PD:
    def __init__(self):
        pass

    def send2pd(self, message):
        # Send a message to PD.
        os.system("echo '" + message + "' | pdsend 3000")