// Author: Amay Kataria
// Date: 02/15/2022
// File: lightManager.js
// Description: Helper module to format the light data properly that is sent across multiple clients. 

const DIRECTION = {
    RIGHT: 1,
    LEFT: 0
}
const OFF_TIME = 2000; // 250 milliseconds. 

class LightManager {
    constructor(io) {
        this.io = io;
        this.timerId = ''; 
    }

    resetLights(payload) {
        // Time interval between each light state. 
        this.intervalTime = 0; 
        // Current index of the light. 
        this.curIdx = -1;
        this.direction = DIRECTION.RIGHT; 
        this.topLights = [];
        this.bottomLights = [];
        let lightData = payload['lights'];
        lightData.forEach(d => {
            this.topLights.push(d['TOP']);
            this.bottomLights.push(d['BOTTOM']);
        });
        // Current light state sent to the clients. 
        this.lightState = []; 
    }

    setupTimer(payload) {
        this.clearTimer(); 
        this.resetLights(payload);
        this.intervalTime = this.getIntervalTime(payload['bpm']);
        this.handleInterval(); 
    }

    handleInterval() {
        let lightPayload = this.getLightPayload();
        console.log(lightPayload);
        this.io.emit('lightData', lightPayload); 
        // If state is none, we need to turn off the lights. Thus, we use OFF_TIME. 
        let timeToWait = lightPayload['state'] === 'NONE' ? OFF_TIME : this.intervalTime; 
        this.updateCurIdx();
        // Recursive call to handle interval until the timerId is cleared. 
        this.timerId = setTimeout(this.handleInterval.bind(this), timeToWait); 
    }

    getLightPayload() {
        // TURN OFF ALL THE LIGHTS. 
        if (this.curIdx === -1 || this.curIdx === 24) {        
            return {state: 'NONE'};
        }

        // Send top light state one by one. 
        if (this.direction === DIRECTION.RIGHT) {
            let d = {'idx': this.curIdx, 'val': this.topLights[this.curIdx]};
            this.lightState.push(d);
            return { state: this.lightState };
        } 

        // Send bottom light state one by one. 
        if (this.direction === DIRECTION.LEFT) {
            let d = {'idx': this.curIdx, 'val': this.bottomLights[this.curIdx]};
            this.lightState.push(d);
            return { state: this.lightState };
        }
    }

    updateCurIdx() {
        if (this.direction === DIRECTION.RIGHT) {
            if (this.curIdx === 24) {
                this.curIdx = 23;
                this.direction = DIRECTION.LEFT; 
                // Reset light state. 
                this.lightState = []; 
            } else {
                this.curIdx = this.curIdx + 1;
            }
        } else {
            if (this.curIdx === -1) {
                this.curIdx = 0;
                this.direction = DIRECTION.RIGHT; 
                // Reset light state. 
                this.lightState = [];
            } else {
                this.curIdx = this.curIdx - 1; 
            }
        }
    }

    clearTimer() {
        if (this.timerId !== '') {
            clearTimeout(this.timerId); 
        }
    }

    getIntervalTime(bpm) {
        return Math.floor(60000/bpm); 
    }

    doesTimerExist() {
        return this.timerId !== '';
    }

    setSocketIo(io) {
        this.io = io;
    }
}

module.exports = LightManager;
// }
// module.exports = {   
//     doesTimerExist: function() {
//         return timerId !== '';
//     },

//     freshTimer: function(payload) {
//         clearTimer(); 
//         resetLights(payload);
//         intervalTime = getIntervalTime(payload['bpm']);
//         handleInterval(); 
//     }
// }

// function handleInterval() {
//     let lightPayload = getLightPayload();
//     socket.emit('lightData', lightPayload); 
//     let timeToWait = lightPayload['state'] === 'NONE' ? OFF_TIME : intervalTime; 
//     // Recursive call to handle interval until the timerId is cleared. 
//     timerId = setTimeout(handleInterval, timeToWait); 
// }

// function clearTimer() {
//     if (timerId !== '') {
//         clearTimeout(timerId); 
//     }
// }

// function getIntervalTime(bpm) {
//     return Math.floor(60000/bpm); 
// }

// // Prepare light data structures to send data to clients.
// // Reset local parameters. 
// function resetLights(payload) {
//     topLights = []; bottomLights = []; 
//     let lightData = payload['lights'];
//     lightData.forEach(d => {
//         topLights.push(d['TOP']);
//         bottomLights.push(d['BOTTOM']);
//     });
//     curIdx = -1; 
//     direction = DIRECTION.RIGHT;
//     intervalTime = 0;
//     lightState = []; 
// }

// function getLightPayload() {
//     // TURN OFF ALL THE LIGHTS. 
//     if (curIdx === -1 || curIdx === 24) {        
//         return {state: 'NONE'};
//     }

//     if (direction === DIRECTION.RIGHT) {
//         lightState.push(topLights[curIdx]);
//         return {state: lightState}
//     } 

//     if (direction === DIRECTION.LEFT) {
//         lightState.push(bottomLights)
//     }

// }


// // clearInterval(intervalId);
// //             let intervalTime = getIntervalTime(payload['bpm']);
// //             // Helper module to prepare the data structures for this payload. 
// //             lightMaker.setupLights(payload); 
// //             // Begin timer. 
// //             intervalId = setInterval(intervalHandler, intervalTime);
// console.log('New interval time(ms): ' + intervalTime);

//                 // Timer doesn't exist - create one!!


//             console.log('starting a new loop with: ' + time + 'ms');
//             let topLights = [], bottomLights = [];
//             let lightData = payload['config']['lights'];
//             // Access lights. 
//             lightData.forEach(d => {
//                 topLights.push(d['TOP']);
//                 bottomLights.push(d['BOTTOM']);
//             });
//             // Start game loop
//             let i = -1;
//             let d = true; 
//             intervalId = setInterval(() => {
//                 // Start with top lights
//                 let v = topLights[i];
//                 let piLoad = {
//                     idx: i,
//                     val: v,
//                     type: d === true ? 1 : 0
//                 }

//                 if (i===24) {
//                     d = false;
//                     i = 23; 
//                     // Payload to turn off.
//                     piLoad = {
//                         idx: -1,
//                         val: -1,
//                         type: -1
//                     }
//                 } else if (i<0) {
//                     d = true;
//                     i = 0; 
//                     // Payload to turn off.
//                     piLoad = {
//                         idx: -1,
//                         val: -1,
//                         type: -1
//                     }
//                 } else if (i==-1) {
//                     piLoad = {
//                         idx: -1,
//                         val: -1,
//                         type: -1
//                     }
//                 }

//                 console.log('Emit: '); console.log(piLoad);
//                 piSocket.emit('testdata', piLoad);
//                 socket.emit('testdata', piLoad)

//                 i = (d === true) ? i+1 : i-1;
//             }, time)
//             // Here I want to 
//             // Route the payload back to other connected clients.
//             // socket.to(room).emit('receiveData', payload); 
//             // var members = io.of('/app').adapter.rooms.get(room).size;
//             // console.log(members-1 + ' members were sent an update.');

//             // Transmit parse this data and send it to the raspberry pi. 
//             // Wait for the callback of success, then send it.         
//             // console.log(payload['config']);
//             // piSocket.emit('wavedata', payload['config']);
//         });
//         // Route this data to the raspberry pi client.
//     });



// // Every web client connects through this code path and subscribes to other events. 
// // All socket events are registered here. 
// function onWebClient(socket) {
//     console.log('New Web Client connection: ' + socket.id); 
//     // Join the room 
//     socket.join(room); 
//     var memberSize = io.of('/app').adapter.rooms.get(room).size;
//     console.log(memberSize + ' members in supersynth.');

//     // ------------------- Database communication -------------------- //
//     socket.on('saveData', (data) => {
//         if (intervalId !== '') {
//             console.log('Clearing previous loop');
//             clearInterval(intervalId);
//         }

//         database.saveData(data).then((payload) => {
//             // Convert the stringified json back to proper json.
//             let json = JSON.parse(payload['config']);
//             payload['config'] = json;

//             // Time is milliseconds. 
//             let time = 60000 / json['bpm'];
//             console.log('starting a new loop with: ' + time + 'ms');
//             let topLights = [], bottomLights = [];
//             let lightData = payload['config']['lights'];
//             // Access lights. 
//             lightData.forEach(d => {
//                 topLights.push(d['TOP']);
//                 bottomLights.push(d['BOTTOM']);
//             });
//             // Start game loop
//             let i = -1;
//             let d = true; 
//             intervalId = setInterval(() => {
//                 // Start with top lights
//                 let v = topLights[i];
//                 let piLoad = {
//                     idx: i,
//                     val: v,
//                     type: d === true ? 1 : 0
//                 }

//                 if (i===24) {
//                     d = false;
//                     i = 23; 
//                     // Payload to turn off.
//                     piLoad = {
//                         idx: -1,
//                         val: -1,
//                         type: -1
//                     }
//                 } else if (i<0) {
//                     d = true;
//                     i = 0; 
//                     // Payload to turn off.
//                     piLoad = {
//                         idx: -1,
//                         val: -1,
//                         type: -1
//                     }
//                 } else if (i==-1) {
//                     piLoad = {
//                         idx: -1,
//                         val: -1,
//                         type: -1
//                     }
//                 }

//                 console.log('Emit: '); console.log(piLoad);
//                 piSocket.emit('testdata', piLoad);
//                 socket.emit('testdata', piLoad)

//                 i = (d === true) ? i+1 : i-1;
//             }, time)
//             // Here I want to 
//             // Route the payload back to other connected clients.
//             // socket.to(room).emit('receiveData', payload); 
//             // var members = io.of('/app').adapter.rooms.get(room).size;
//             // console.log(members-1 + ' members were sent an update.');

//             // Transmit parse this data and send it to the raspberry pi. 
//             // Wait for the callback of success, then send it.         
//             // console.log(payload['config']);
//             // piSocket.emit('wavedata', payload['config']);
//         });
//         // Route this data to the raspberry pi client.
//     });
