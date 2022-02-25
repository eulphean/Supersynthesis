// Name: EditModeStore.js
// Author: Amay Kataria. 
// Date: 02/24/2022
// Description: This data store keeps track of when the user is interacting with the canvas and when
// are we ready to remove that interactive pattern. 

class EditModeStore {
    constructor() {
        this.isEditMode = false; 
        this.isUserInteracting = false; 
        this.isPopupActive = false; 
        this.subscribers = []; 
    }

    subscribe(listener) {
        this.subscribers.push(listener); 
    }

    setEditMode(val) {
        if (this.isEditing !== val) {
            this.isEditMode = val;
            this.subscribers.forEach(s => s()); 
        }
    }

    setUserInteracting(val) {
        if (this.isUserInteracting !== val) {
            this.isUserInteracting = val; 
            this.subscribers.forEach(s => s());
        }
    }

    setIsPopupActive(val) {
        if (this.isPopupActive !== val) {
            this.isPopupActive = val; 
            this.subscribers.forEach(s => s());
        }
    }
}

export default new EditModeStore();