"use strict";

/**
 * @module exports the pipemanager class
 */
module.exports = exports = Board;

const Cell = require('./cell');

function Board(width, height){
    this.width = width;
    this.height = height;
}
