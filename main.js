const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const emptyFieldCharacter = '░';
const pathCharacter = '*';


function askNextMove() {
  const direction = prompt('Which way would you like to go?');
  direction = direction.toLowerCase();

  return direction;
}

function willYouReplay() {
  const restart = prompt("Start Again? Type 'y' to start over or 'n' to exit.");
  restart = restart.toLowerCase();

  return restart === 'y' ?
  true : restart === 'n' ?
  false :
  willYouReplay();
}


class Field {
  constructor(field) {
    this._field = field;
  }

  get field() {
    return this._field;
  }

  print() {
    this.field.forEach(row => console.log(row.join(``)));
  }

  findCurrentPosition() {

    const currentPosition = {
      i: 0,
      j: 0
    }

    this.field.forEach((row, rowIndex) => {
      const indexOfAsteriskInRow = row.indexOf('*');

      if (indexOfAsteriskInRow !== -1) {
        currentPosition.j = indexOfAsteriskInRow;
        currentPosition.i = rowIndex;
      };
    });

    return currentPosition;
  }

  move(findCurrentPosition, direction) {
    const moves = {
      up: 'w',
      down:'s',
      left:'a',
      right:'d'
    };


    const targetPosition = {
      i: 0,
      j: 0
    };

    if (direction === moves.up) {
      targetPosition.i = currentPosition.i -1;
      targetPosition.j = currentPosition.j
    } else if (direction === moves.down) {
      targetPosition.i = currentPosition.i +1;
      targetPosition.j = currentPosition.j;
    } else if (direction === moves.left) {
      targetPosition.i = currentPosition.i;
      targetPosition.j = currentPosition.i -1;
    } else if (direction === moves.right) {
      targetPosition.i = currentPosition.i;
      targetPosition.j = currentPosition.i +1;
    } else {
      console.log("Invalid move: please use 'a' for left, 'w' for up, 's' fordown and 'd' for right.");
      askNextMove()
    };

    const target = this.field[targetPosition.i][targetPosition.j];

    if (target) {
      if (target === hole) {

      } else if (target === hat) {

      } else if (target === emptyFieldCharacter) {

      }
    } else {
      console.log('Oh no! You fell of the field! GAME OVER!')
      willYouReplay();
    };

  }

  static generateField(heigth, width, percentage) {
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

    for (let j= arrayToShuffle.length -1; j > 0; j--) {
      const randomI =
      Math.floor(Math.random()*arrayToShuffle.length);

      const lastElement = arrayToShuffle[j];
      arrayToShuffle[j] = arrayToShuffle[randomI];
      arrayToShuffle[randomI] = lastElement;
    }

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


const newArray = Field.generateField(7, 5, 20);

const newField = new Field(newArray);
newField.print();
console.log(newField.findCurrentPosition());
