# Author: Amay Kataria
# Date: 02/22/2022
# File: pd.py
# Description: Simple module to handle sending messages to PureData. 
# If PD is not open, this will show a connection error but will not crash
# the script. It's like a warning. 

import os
def send2pd(message):
    # Send a message to PD.
    os.system("echo '" + message + "' | pdsend 3000")

def handlePdOscMessage(address, args):
    # Craft the message. 
        if (address == '/dry'):
            message = '1 ' + str(args) + ';'
        elif (address == '/wet'):
            message = '2 ' + str(args) + ';'
        elif (address == '/volume'):
            message = '3 ' + str(args) + ';'
        elif (address == '/filterFreq'):
            message = '4 ' + str(args) + ';'
        elif (address == '/delayFeedback'):
            message = '5 ' + str(args) + ';'
        elif (address == '/pan'):
            message = '6 ' + str(args) + ';'
        elif (address == '/mute'):
            message = '7 ' + str(args) + ';'
        elif ('envelope' in address):
            message = processEnvelope(address, args)
        elif ('wavetable' in address):
            message = processWavetable(address, args)
        elif ('delayTime' in address):
            message = processDelayTime(address, args)

        if (message != -1):    
            # Send to pure data. 
            print(message)
            send2pd(message)

def processEnvelope(address, args):
    s = int(address.split('/')[2])
    idx = -1

    # Dont send anything on a noteOff. 
    if (args == 1):
        if (s == 4):
            idx = 0 
        elif (s == 3):
            idx = 1
        elif (s == 2):
            idx = 2
        elif (s == 1): 
            idx = 3
        message = '9 ' + str(idx) + ';'
        return message
    else:
        return -1

def processWavetable(address, args):
    s = int(address.split('/')[2])
    idx = -1
    # Dont send anything on a noteOff. 
    if (args == 1):
        if (s == 4):
            idx = 0 
        elif (s == 3):
            idx = 1
        elif (s == 2):
            idx = 2
        elif (s == 1): 
            idx = 3
        message = '8 ' + str(idx) + ';'
        return message
    else:
        return -1

def processDelayTime(address, args):
    s = int(address.split('/')[2])
    idx = -1
    # Dont send anything on a noteOff. 
    if (args == 1):
        if (s == 3):
            idx = 0 
        elif (s == 2):
            idx = 1
        elif (s == 1):
            idx = 2
        message = '10 ' + str(idx) + ';'
        return message
    else:
        return -1