const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const emptyFieldCharacter = '░';
const pathCharacter = '*';


class Game {
  constructor() {
    this._field = [];
    this._currentPosition = {
      i: 0,
      j: 0
    }
  }

  get field() {
    return this._field;
  }

  play() {
    const enteredHeigth = Number(prompt(`Enter field heigth:`));
    const enteredWwidth = Number(prompt(`Enter field width:`));
    const holePercentage = Number(prompt(`Enter percentage of holes:`));


    this.generateField(enteredHeigth, enteredWwidth, holePercentage);


    this.initialPosition;
    this.print();
    this.move();

  }

  print() {
    this._field.forEach(row => console.log(row.join(``)));

  }

  get initialPosition() {

    this.field.forEach((row, rowIndex) => {
      const indexOfAsteriskInRow = row.indexOf('*');

      if (indexOfAsteriskInRow !== -1) {
        this._currentPosition.j = indexOfAsteriskInRow;
        this._currentPosition.i = rowIndex;
      };
    });

    return this._currentPosition;
  }

  askNextMove() {
    let direction = prompt('Which way would you like to go?');
    direction = direction.toLowerCase();

    return direction;
  }

  move() {
    const moves = {
      up: 'w',
      down:'s',
      left:'a',
      right:'d'
    };

    const direction = this.askNextMove();

    const targetPosition = {
      i: 0,
      j: 0
    }

    if (direction === moves.up) {
      targetPosition.i = this._currentPosition.i -1;
      targetPosition.j = this._currentPosition.j
    } else if (direction === moves.down) {
      targetPosition.i = this._currentPosition.i +1;
      targetPosition.j = this._currentPosition.j;
    } else if (direction === moves.left) {
      targetPosition.i = this._currentPosition.i;
      targetPosition.j = this._currentPosition.j -1;
    } else if (direction === moves.right) {
      targetPosition.i = this._currentPosition.i;
      targetPosition.j = this._currentPosition.j +1;
    } else {
      console.log("Invalid move: please use 'a' for left, 'w' for up, 's' for down and 'd' for right.");
      this.move();
    };


    const target = this.field[targetPosition.i][targetPosition.j];

    if (target) {


      if (target === hole) {
        console.log('Oh no! You fell in a hole! GAME OVER!')
        this.willYouReplay();
      } else if (target === hat) {
        console.log('Congratulations! You found your hat!')
        this.willYouReplay();
      } else if (target === emptyFieldCharacter) {
        this._field[targetPosition.i].splice(targetPosition.j, 1, pathCharacter);
        // this._field[this._currentPosition.i].splice(this._currentPosition.j, 1, emptyFieldCharacter);
        this._currentPosition = targetPosition;

        this.print();
        this.move();
      };
      } else {
        console.log('Oh no! You fell of the field! GAME OVER!')
        this.willYouReplay();
      };

  }

  willYouReplay() {
    let restart = prompt("Start Again? Type 'y' to start over or 'n' to exit.");
    restart = restart.toLowerCase();


    restart === 'y' ? this.play() :
    restart === 'n' ? console.log(`Bye! Thanks for playing!`) :
    willYouReplay();


  }

  generateField(heigth, width, percentage) {
    const slotsToFill =
    heigth * width;
    const fillWithHoles =
    slotsToFill*percentage/100;
    const fillWithEmpties =
    slotsToFill - fillWithHoles -2;

    const arrayToShuffle = [];
    for (let i=0; i < slotsToFill; i++) {
      i < fillWithHoles ?
      arrayToShuffle.push(hole) :
      i < fillWithHoles + fillWithEmpties ?
      arrayToShuffle.push(emptyFieldCharacter) :
      i < slotsToFill -1 ?
      arrayToShuffle.push(hat) :
      arrayToShuffle.push(pathCharacter);
    }

    const shuffledArray = [];
    for (let j= arrayToShuffle.length -1; j > 0; j--) {
      const randomI =
      Math.floor(Math.random()*arrayToShuffle.length);

      const lastElement = arrayToShuffle[j];
      arrayToShuffle[j] = arrayToShuffle[randomI];
      arrayToShuffle[randomI] = lastElement;
    };

    const formatedArray = [];
    let l = 0;
    for (let k=0; k < heigth; k++) {
      const newRow = arrayToShuffle.slice(l, l + width);
      l += width;
      formatedArray.push(newRow);
    }

   this._field = formatedArray;
   return formatedArray;
  }
}



const game = new Game();
game.play();
