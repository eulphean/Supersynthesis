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