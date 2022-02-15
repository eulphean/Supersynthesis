import mido
import rtmidi
import os

msg = mido.Message('note_on', note=60)
mido.open_output('Hello')
mido.send(msg)
# message = '0 ' + msg + ';'
# os.system("echo '" + message + "' | pdsend 3000")
