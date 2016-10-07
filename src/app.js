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
