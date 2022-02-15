# Each tube can be turned on and turned off.
# Each tube is also a speaker.
class Tube:
    def __init__(self, id) -> None:
        self.id = id

    def print(self) -> None:
        print(self.id)
    
    def on(self):
        print("id: " + str(self.id) + ", state: " + "on")
    
    def off(self):
        print("id: " + str(self.id) + ", state: " + "off")