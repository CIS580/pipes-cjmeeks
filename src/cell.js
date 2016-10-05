"use strict";

/**
 * @module exports the pipemanager class
 */
module.exports = exports = Cell;

function Cell(width, height, start){
    this.cellWidth = width;
    this.cellHeight = height;
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
    this.spritesheet = new Image();
    this.spritesheet.src = "./assets/pipes.png";
    this.pipes = [];
    this.pipes.add({sx:0,sy:0,width:27,height:27, name:"4way"});
    this.pipes.add({sx:0,sy:0,width:27,height:27, name:"rightleft"});
    this.pipes.add({sx:0,sy:0,width:27,height:27, name:"updown"});
    this.pipes.add({sx:0,sy:0,width:27,height:27, name:"rightdown"});
    this.pipes.add({sx:0,sy:0,width:27,height:27, name:"leftdown"});
    this.pipes.add({sx:0,sy:0,width:27,height:27, name:"upright"});
    this.pipes.add({sx:0,sy:0,width:27,height:27, name:"upleft"});
    this.pipes.add({sx:0,sy:0,width:27,height:27, name:"leftrightdown"});
    this.pipes.add({sx:0,sy:0,width:27,height:27, name:"leftupdown"});
    this.pipes.add({sx:0,sy:0,width:27,height:27, name:"uprightdown"});
    this.pipes.add({sx:0,sy:0,width:27,height:27, name:"leftupright"});

    this.currentIndex = Math.floor(Math.random()*pipes.length-1);
}

function update(state, elapsedTime){

}
