
const {Elements, Setup} = require('./field.js');
const Game = require('./game.js');

const game = new Game(new Setup(new Elements()));
game.play();

// const field = new Field();
// field._field = [[`a`,`b`,`c`],[`d`,`e`,`f`],[`g`,`h`,`i`]];
// field.isFieldValid();


