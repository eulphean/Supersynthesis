// Name: UserInteractionStore.js
// Author: Amay Kataria. 
// Date: 02/24/2022
// Description: This data store keeps track of when the user is interacting with the canvas and when
// are we ready to remove that interactive pattern. 

class UserInteractionStore {
    constructor() {
        this.isInteracting = false; 
        this.subscriber = ''; 
    }

    subscribe(listener) {
        this.subscriber = listener; 
    }

    setInteraction(val) {
        if (this.isInteracting !== val) {
            this.isInteracting = val;
            this.subscriber(this.isInteracting); 
        }
    }
}

export default new UserInteractionStore();