/*
  Name: Sequencer.js
  Author: Amay Kataria
  Date: 03/03/2022
  Description: A class to render the sequencer object on the screen. 
*/
import EditModeStore from "../stores/EditModeStore";
import SequencerStore from "../stores/SequencerStore";

export default class SequencerBubble {
    constructor(s) {
        // Sketch object. 
        this.p5 = s; 

        this.sequencerActiveColor = this.p5.color(255, 0, 0, 200);
        this.sequencerInactiveColor = this.p5.color(255, 0, 0, 100);
    }

    draw(light) {
        let indices = SequencerStore.getIndices();
        let isEditMode = EditModeStore.isEditMode;
        for (let i = 0; i < indices.length; i++) {
            let idx = indices[i];     
            if (idx === light.curIdx) {
                if (isEditMode) {
                    this.p5.fill(this.sequencerInactiveColor);                
                } else {
                    this.p5.fill(this.sequencerActiveColor);                
                }
                
                let newX = light.getNewPos() + light.lightWidth/2; 
                this.p5.ellipse(newX + light.lightWidth/2, this.p5.height/2, light.lightWidth * 1.5, light.lightWidth * 1.5);
            }
        }
    }
}
