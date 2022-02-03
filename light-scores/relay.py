# Relay module to setup things on it.
class Relay:
    def __init__(self, debug = True) -> None:
        self.debug = debug
        pass

    def on(self, idx) -> None:
        # TODO: Map the index to the right GPIO pin on the pi.
        if (self.debug):
            print("On, idx: " + str(idx))
        else:
            # Set GPIO high. 
            pass

    def off(self, idx) -> None:
        # TODO: Map the index to the right GPIO pin on the pi. 
        if (self.debug):
            print("Off, idx: " + str(idx))
        else:
            # Set GPIO low.
            pass

