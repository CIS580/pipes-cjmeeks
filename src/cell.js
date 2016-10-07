"use strict";

/**
 * @module exports the pipemanager class
 */
module.exports = exports = Cell;

function Cell(width, height, start, end, water){
    this.cellWidth = width;
    this.cellHeight = height;
    this.ratio = width/height;
    this.input = {
        up: false,
        down: false,
        left: false,
        right: false
    };
    this.connections = {
        up: false,
        down: false,
        left: false,
        right: false
    };
    this.start = start;
    this.end = end;
    this.background = new Image();
    this.background.src = "./assets/background.png";
    this.spritesheet = new Image();
    this.spritesheet.src = "./assets/pipes.png";
    this.water = water;
    this.filled = false;
    this.show = false;
    this.waterWidth = 0;
    this.waterHeight = 0;
    this.pipes = [];
    this.pipes.push({sx:0,sy:0,width:31,height:32, name:"4way"});
    this.pipes.push({sx:95,sy:34,width:32,height:29, name:"rightleft"});
    this.pipes.push({sx:97,sy:64,width:30,height:32, name:"updown"});
    this.pipes.push({sx:32,sy:32,width:31,height:32, name:"rightdown"});
    this.pipes.push({sx:63,sy:32,width:31,height:32, name:"leftdown"});
    this.pipes.push({sx:32,sy:64,width:31,height:32, name:"upright"});
    this.pipes.push({sx:63,sy:64,width:31,height:31, name:"upleft"});
    this.pipes.push({sx:31,sy:95,width:32,height:33, name:"leftrightdown"});
    this.pipes.push({sx:63,sy:95,width:32,height:33, name:"leftupdown"});
    this.pipes.push({sx:31,sy:128,width:32,height:33, name:"uprightdown"});
    this.pipes.push({sx:64,sy:128,width:32,height:33, name:"leftupright"});

    this.watever = '<embed src="./assets/Puzzle Theme1.wav" autostart="true" loop="true" hidden="true">';

    this.currentIndex = Math.floor(Math.random()*(this.pipes.length-1));
    var self = this;

}
Cell.prototype.updateConnections = function(cellIndex, board){
    var top = cellIndex-1;
    var right = cellIndex+8;
    var left = cellIndex-8;
    var bot = cellIndex + 1;
    //if top is a connection
    if(top > 0 && top < 64){
        if(board[top].show){
            if(board[top].input.down == true && board[cellIndex].input.up ==true){
                board[top].connections.down = true;
                board[cellIndex].connections.up = true;
            }
        }
    }
    //bottom
    if(bot > 0 && bot < 64){
        if(board[bot].show){
            if(board[bot].input.up == true && board[cellIndex].input.down ==true){
                board[bot].connections.up = true;
                board[cellIndex].connections.down = true;
            }
        }
    }
    //left
    if(left > 0 && left < 64){
        if(board[left].show){
            if(board[left].input.right == true && board[cellIndex].input.left ==true){
                board[left].connections.right = true;
                board[cellIndex].connections.left = true;
            }
        }
    }
    //right
    if(right > 0 && right < 64){
        if(board[right].show){
            if(board[right].input.left == true && board[cellIndex].input.right ==true){
                board[right].connections.left = true;
                board[cellIndex].connections.right = true;
            }
        }
    }
    //take in cell index that we are looking for connections around
    //return
}
Cell.prototype.nextPipe = function(){
    if(this.currentIndex >= 10 && this.water == false){
        this.currentIndex = 0;
    }
    else{
        this.currentIndex ++;
    }
}
Cell.prototype.update = function(speed){
    if(this.water && !this.filled){
        //conditionals
        this.waterWidth = this.waterWidth + ((speed/10)*this.ratio);
        this.waterHeight = this.waterHeight + (speed/10);
    }
    if(this.waterWidth >= 1024 || this.waterHeight >= 860){
        this.filled = true;
    }
    switch(this.pipes[this.currentIndex].name){
        case "4way":
            this.input.up = true;
            this.input.down = true;
            this.input.left = true;
            this.input.right = true;
            //console.log(this.input.up);
            break;
        case "rightleft":
            this.input.up = false;
            this.input.down = false;
            this.input.left = true;
            this.input.right = true;
            break;
        case "updown":
            this.input.up = true;
            this.input.down = true;
            this.input.left = false;
            this.input.right = false;
            break;
        case "rightdown":
            this.input.up = false;
            this.input.down = true;
            this.input.left = false;
            this.input.right = true;
            break;
        case "leftdown":
            this.input.up = false;
            this.input.down = true;
            this.input.left = true;
            this.input.right = false;
            break;
        case "upright":
            this.input.up = true;
            this.input.down = false;
            this.input.left = false;
            this.input.right = true;
            break;
        case "upleft":
            this.input.up = true;
            this.input.down = false;
            this.input.left = true;
            this.input.right = false;
            break;
        case "leftrightdown":
            this.input.up = false;
            this.input.down = true;
            this.input.left = true;
            this.input.right = true;
            break;
        case "leftupdown":
            this.input.up = true;
            this.input.down = true;
            this.input.left = true;
            this.input.right = false;
            break;
        case "uprightdown":
            this.input.up = true;
            this.input.down = true;
            this.input.left = false;
            this.input.right = true;
            break;
        case "leftupright":
            this.input.up = true;
            this.input.down = false;
            this.input.left = true;
            this.input.right = true;
            break;
    }
}

Cell.prototype.render = function(destX, destY, width, height, elapsedTime, ctx){

    if(!this.start&& !this.end){
        ctx.drawImage(this.background,
            0, 0, 100, 100,
            destX, destY, width, height
        );
        if(this.show){
            ctx.drawImage(this.spritesheet,
            this.pipes[this.currentIndex].sx, this.pipes[this.currentIndex].sy, this.pipes[this.currentIndex].width, this.pipes[this.currentIndex].height,
            destX, destY, width, height
            );
        }
    }
    else if(!this.water){
        if(this.start && !this.end){
          ctx.fillStyle = "green";
          ctx.fillRect(destX,destY, width, height);
          ctx.fillStyle = "black";
          ctx.font = "bold 20px Arial";
          ctx.fillText("Start", destX+40, destY+40);
        }
        else if(this.end == true && this.start==false){
            ctx.fillStyle = "red";
          ctx.fillRect(destX,destY, width, height);
          ctx.fillStyle = "black";
          ctx.font = "bold 20px Arial";
          ctx.fillText("End", destX+50, destY+20);
        }
    }
    if(this.water && !(this.filled)){
        ctx.fillStyle = "blue";
        ctx.fillRect(destX,destY, Math.floor(this.waterWidth), Math.floor(this.waterHeight));
        if(this.waterWidth >= 128 || this.waterHeight >= 108){
            this.filled = true;
        }
    }
    else if(this.filled && this.water){
        ctx.fillStyle = "blue";
        ctx.fillRect(destX,destY, width, height);
    }


}
