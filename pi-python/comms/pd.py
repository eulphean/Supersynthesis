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
    # Default message when we want to filter everything unneeded out.
    message = -1
    
    # Craft the message. 
    if ('dry' in address):
        message = '1 ' + str(args) + ';'
    elif ('wet' in address):
        message = '2 ' + str(args) + ';'
    elif ('volume' in address):
        message = '3 ' + str(args) + ';'
    elif ('filterFreq' in address):
        message = '4 ' + str(args) + ';'
    elif ('delayFeedback' in address):
        message = '5 ' + str(args) + ';'
    elif ('pan' in address):
        message = '6 ' + str(args) + ';'
    elif ('mute' in address):
        message = '7 ' + str(args) + ';'
    elif ('envelope' in address):
        message = processEnvelope(address, args)
    elif ('wavetable' in address):
        message = processWavetable(address, args)
    elif ('delayTime' in address):
        message = processDelayTime(address, args)

    if (message != -1):    
        # Send to pure data. 
        send2pd(message)

def processEnvelope(address, args):
    s = int(address.split('/')[3])
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
    s = int(address.split('/')[3])
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
    s = int(address.split('/')[3])
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