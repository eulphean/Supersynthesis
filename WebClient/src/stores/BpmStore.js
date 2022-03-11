// Name: BpmStore.js
// Author: Amay Kataria
// Date: 03/03/2022
// Description: This data store is respnsible to hold the Bpm that is retrieved from the database
// as well as the Bpm that the user is synthesisizng locally. 

class BpmStore {
    constructor() {
        // Bpm coming from the database. 
        this.dbBpm = 150;
        // Locally modified Bpm. 
        this.localBpm = 150; 

        // Fire this when new Bpm is received from the database. 
        this.subscribers = [];
    }

    subscribe(listener) {
        this.subscribers.push(listener);
    }

    getDbBpm() {
        return this.dbBpm; 
    }

    getLocalBpm() {
        return this.localBpm; 
    }

    setDbBpm(newBpm) {
        // New payload from db. 
        // Reset both db and local bpm. 
        this.dbBpm = newBpm;
        this.localBpm =  newBpm;

        // Let subscribers know new Bpm values are updated. 
        this.subscribers.forEach(l => {
            l();
        });
    }

    setLocalBpm(localBpm) {
        // Whenever local bpm gets updated, we want to let 
        // subscribers know that we have new values. 
        if (this.localBpm !== localBpm) {
            this.localBpm = localBpm;
            this.subscribers.forEach(l => {
                l();
            });
        }
    }
}

export default new BpmStore(); 