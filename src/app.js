"use strict";

/* Classes */
const Game = require('./game');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
image.src = 'assets/pipes.png';
var debug = true;
var widthCell = Math.floor(canvas.width/8);
var heightCell = Math.floor(canvas.height/8);


canvas.onclick = function(event) {
  event.preventDefault();
  // TODO: Place or rotate pipe tile
}
var currentIndex, currentX, currentY;
canvas.onmousemove = function(event){
    event.preventDefault();
    currentX = event.offsetX;
    currentY = event.offsetY;
    var x = Math.floor((currentX + 3) / (canvas.width/8));
    var y = Math.floor((currentY + 3) / (canvas.height/8));
    currentIndex = y * 8 + x;
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
  if(debug){
    var x = currentIndex % 8;
    var y = Math.floor(currentIndex / 8);
    ctx.strokeStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(currentX, currentY, 3, 0, 2*Math.PI);
    ctx.rect(x * widthCell + 3, y * heightCell + 3, widthCell-2, heightCell-2);
    ctx.stroke();
  }


  // TODO: Render the board

}
