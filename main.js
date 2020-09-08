const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const emptyFieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor() {
    this._field = [];
    this._initialPosition = {
      i:0,
      j:0
    };
    this._hatPosition = {
      i:0,
      j:0
    };
  }

  get field() {
    return this._field;
  }

  get initialPosition() {
    return this._initialPosition;
  }

  get hatPosition() {
    return this._hatPosition;
  }

  findInitialPosition(field) {

    field.forEach((row, rowIndex) => {
      const indexOfAsteriskInRow = row.indexOf('*');

      if (indexOfAsteriskInRow !== -1) {
        this._initialPosition.j = indexOfAsteriskInRow;
        this._initialPosition.i = rowIndex;
      };
    });
  }

  findHatPosition(field) {

    field.forEach((row, rowIndex) => {
      const indexOfHatInRow = row.indexOf('^');

      if (indexOfHatInRow !== -1) {
        this._hatPosition.j = indexOfHatInRow;
        this._hatPosition.i = rowIndex;
      };
    });
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
    };

    this.findInitialPosition(formatedArray);
    this.findHatPosition(formatedArray);

    return this.isFieldValid(formatedArray) ?
    this._field = formatedArray :
    this.generateField(heigth, width, percentage);
  }

  isFieldValid(field) {
    this.findHatPosition(field);

    const testField = field.map(row => row.map(spot => spot));

    const openSet = [];
    const closedSet = [];

    let initialSpot = {};
    let hatSpot = {};

    testField.forEach((row, iIndex, array) => {
      row.forEach((spot, jIndex) => {
        array[iIndex][jIndex] = new Spot(iIndex, jIndex, spot, this.hatPosition);

        if (spot === `*`) {
          initialSpot = array[iIndex][jIndex];
        } else if (spot === `^`) {
          hatSpot = array[iIndex][jIndex];
        };
      });
    });

    testField.forEach((row, iIndex, array) => {
      row.forEach((spot, jIndex) => {
        spot.findNeighbours(array);
      });
    });

    openSet.push(initialSpot);


    function removeFromArray(array, element) {
      for (let i= array.length-1; i>=0; i--) {
        if(array[i] === element) {
          array.splice(i, 1);
        };
      };
    };


    function isValid() {

      while (openSet.length > 0) {
      let indexShorterWay = 0;

        for(let index = 0; index < openSet.length; index++) {

          const candidateSpot = openSet[index];
          const currentPathSpot = openSet[indexShorterWay];

          const candidateHeuristic = candidateSpot.guessTotalDistanceCost();
          const currentPathHeuristic = currentPathSpot.guessTotalDistanceCost();

          if(candidateHeuristic < currentPathHeuristic) {
            indexShorterWay = index;
          };

          const currentSpot = openSet[indexShorterWay];
          const neighbours = currentSpot.neighbours;

          if(currentSpot === hatSpot) {
            return true;
          };

          removeFromArray(openSet, currentSpot);
          closedSet.push(currentSpot);

          neighbours.forEach((neighbour) => {

            if (!closedSet.includes(neighbour)) {

              const possibleNeighbourDistance = currentSpot.distanceRun +1;

              if(openSet.includes(neighbour)) {
                if(possibleNeighbourDistance < neighbour.distanceRun) {
                  neighbour.distanceRun = possibleNeighbourDistance;
                };

              } else {
                neighbour.distanceRun = possibleNeighbourDistance;
                openSet.push(neighbour);
              };
            };
          });
        };
      };

      if(openSet.length <= 0) {
        console.log(openSet.length);
        return false;
      };
    };


    // const hatSpot = new Spot(this.hatPosition.i, this.hatPosition.j);


    // const start = field[this.initialPosition.i][this.initialPosition.j];

    // return !openSet === [] ? true : false;
    return isValid();
  }
}

class Spot {
    constructor(i, j, element, hatPosition) {
    this.i = i;
    this.j = j;
    this.element = element;

    this.distanceRun = 0;

    this.xDistanceToHat = hatPosition.i - this.i;
    this.yDistanceToHat = hatPosition.j - this.j;
    this.distanceToHat = Math.sqrt(this.xDistanceToHat**2 + this.yDistanceToHat**2);

    this.guessedTotalDistanceCost = this.guessTotalDistanceCost();

    this.neighbours = [];
    }

    guessTotalDistanceCost() {
      this.guessedTotalDistanceCost = this.distanceRun + this.distanceToHat;
      return this.guessedTotalDistanceCost;
    }

    findNeighbours(field) {
      const i = this.i;
      const j = this.j;

      if(field[i+1] && field[i+1][j] && field[i+1][j].element === emptyFieldCharacter
      || field[i+1] && field[i+1][j] && field[i+1][j].element === hat) {
      this.neighbours.push(field[i+1][j]);
    };
      if(field[i-1] && field[i-1][j] && field[i-1][j].element === emptyFieldCharacter
      || field[i-1] && field[i-1][j] && field[i-1][j].element === hat) {
      this.neighbours.push(field[i -1][j]);
    };
      if(field[i] && field[i][j+1] && field[i][j+1].element === emptyFieldCharacter
      || field[i] && field[i][j+1] && field[i][j+1].element === hat) {
      this.neighbours.push(field[i][j +1]);
    };
      if(field[i] && field[i][j-1] && field[i][j-1].element === emptyFieldCharacter
      || field[i] && field[i][j-1] && field[i][j-1].element === hat) {
      this.neighbours.push(field[i][j -1]);
    };
    }
}

class Game {
  constructor() {
    this._fieldObject = new Field();
    this._currentPosition = {
      i:0,
      j:0
    };
  }


  get fieldObject() {
    return this._fieldObject;
  }

  get currentPosition() {
    return this._currentPosition;
  }

  play() {
    const enteredHeigth = Number(prompt(`Enter field heigth:`));
    const enteredWidth = Number(prompt(`Enter field width:`));
    const holePercentage = Number(prompt(`Enter percentage of holes:`));


    this.fieldObject.generateField(enteredHeigth, enteredWidth, holePercentage);
    this._currentPosition = this._fieldObject._initialPosition;
    this.print();
    this.move();

  }

  print() {
    this.fieldObject.field.forEach(row => console.log(row.join(``)));
  }

  get initialPosition() {
    return this.fieldObject.initialPosition;
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
      targetPosition.i = this.currentPosition.i -1;
      targetPosition.j = this.currentPosition.j
    } else if (direction === moves.down) {
      targetPosition.i = this.currentPosition.i +1;
      targetPosition.j = this.currentPosition.j;
    } else if (direction === moves.left) {
      targetPosition.i = this.currentPosition.i;
      targetPosition.j = this.currentPosition.j -1;
    } else if (direction === moves.right) {
      targetPosition.i = this.currentPosition.i;
      targetPosition.j = this.currentPosition.j +1;
    } else {
      console.log("Invalid move: please use 'a' for left, 'w' for up, 's' for down and 'd' for right.");
      this.move();
    };

    if (!this.fieldObject.field[targetPosition.i] || !this.fieldObject.field[targetPosition.i][targetPosition.j]) {
      console.log('Oh no! You fell of the field! GAME OVER!')
      this.willYouReplay();
      return;
    }

    const target = this.fieldObject.field[targetPosition.i][targetPosition.j];

    if (target === hole) {
      console.log('Oh no! You fell in a hole! GAME OVER!')
      this.willYouReplay();
      return;
    }

    if (target === hat) {
      console.log('Congratulations! You found your hat!')
      this.willYouReplay();
      return;
    }

    if (target === emptyFieldCharacter) {
      this._fieldObject._field[targetPosition.i].splice(targetPosition.j, 1, pathCharacter);
      // this._field[this._currentPosition.i].splice(this._currentPosition.j, 1, emptyFieldCharacter);
      this._currentPosition = targetPosition;

      this.print();
      this.move();
    };
  }

  willYouReplay() {
    let restart = prompt("Start Again? Type 'y' to start over or 'n' to exit.");
    restart = restart.toLowerCase();


    restart === 'y' ? this.play() :
    restart === 'n' ? console.log(`Bye! Thanks for playing!`) :
    willYouReplay();

  }
}



const game = new Game();
game.play();

// const field = new Field();
// field._field = [[`a`,`b`,`c`],[`d`,`e`,`f`],[`g`,`h`,`i`]];
// field.isFieldValid();

module.exports = {
  Field
}
