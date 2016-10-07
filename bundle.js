(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes */
const Game = require('./game.js');
const Cell = require('./cell.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var levelDom = document.getElementById('level');
var scoreDom = document.getElementById('score');
var rotate = new Audio();
rotate.src = "./assets/Blip_Select3.wav";
var image = new Image();
image.src = 'assets/pipes.png';
var debug = false;
var level = 1;
var score = 0;
var widthCell = Math.floor(canvas.width / 8);
var heightCell = Math.floor(canvas.height / 8);
var board = [];
var i = 0;
var j = 0;
var state = "waiting";
var currentIndex, currentX, currentY, rotatePipeIndex;
for(i = 0; i < 64; i++){
    if(i == 0){
        board.push(new Cell(widthCell, heightCell, true, false, true));
    }
    else if(i == 63){
        board.push(new Cell(widthCell, heightCell, false, true, false));
    }
    else{
        board.push(new Cell(widthCell, heightCell, false, false, false));
    }
}
board.forEach(function(cell){console.log(cell.show);});

canvas.oncontextmenu = function(event){
    event.preventDefault();
    currentX = event.offsetX;
    currentY = event.offsetY;
    var x = Math.floor((currentX ) / (canvas.width/8));
    var y = Math.floor((currentY ) / (canvas.height/8));
    rotatePipeIndex = x * 8 + y;
    if(board[rotatePipeIndex].show){
        board[rotatePipeIndex].nextPipe(state);
        rotate.play();
    }


}
canvas.onclick = function (event) {
  event.preventDefault();
  currentX = event.offsetX;
  currentY = event.offsetY;
  var x = Math.floor((currentX ) / (canvas.width/8));
  var y = Math.floor((currentY ) / (canvas.height/8));
  rotatePipeIndex = x * 8 + y;
   if(!board[rotatePipeIndex].show){
       board[rotatePipeIndex].show = true;
       rotate.play();
   }

}
canvas.onmousemove = function (event){
    event.preventDefault();
    if(debug){
        currentX = event.offsetX;
        currentY = event.offsetY;
        var x = Math.floor((currentX ) / (canvas.width/8));
        var y = Math.floor((currentY ) / (canvas.height/8));
        currentIndex = y * 8 + x;
    }

}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  // TODO: Advance the fluid
  board.forEach(function(cell){cell.update(level)});
  var x = 0;
  board.forEach(function(cell){
      cell.updateConnections(x, board);
      x++;
  });

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "#777777";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //console.log(board.length);


  if(debug){
    var x = currentIndex % 8;
    var y = Math.floor(currentIndex / 8);
    ctx.strokeStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(currentX, currentY, 3, 0, 2*Math.PI);
    ctx.rect(x * widthCell, y * heightCell, widthCell, heightCell);
    ctx.stroke();
  }
  // TODO: Render the board
  i = 0;
  board.forEach(function(cell){
    cell.render(Math.floor(i/8)*widthCell, Math.floor(i%8)*heightCell, widthCell, heightCell, elapsedTime, ctx);
    i++;
  });
  levelDom.innerHTML = level;
  scoreDom.innerHTML = score;
}

},{"./cell.js":2,"./game.js":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}]},{},[1]);
