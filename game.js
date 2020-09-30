
 class Game {
    constructor(fieldSetup) {
      this._setup = fieldSetup;
      this.prompt = require('prompt-sync')({sigint: true});
      this._currentPosition = {
        i:0,
        j:0
      };
    }
  
    get setup() {
      return this._setup;
    }
  
    get currentPosition() {
      return this._currentPosition;
    }
  
    set currentPosition(newPosition) {
      this._currentPosition = newPosition;
    }
  
    get initialPosition() {
      this.setup.findSingleComponentPosition(this.setup.field, this.setup.path);
      return this.setup.pathPosition;
    }
    
    play() {
      const inputHeigth = Number(this.prompt(`Enter field heigth:`));
      const inputWidth = Number(this.prompt(`Enter field width:`));
      const holePercentage = Number(this.prompt(`Enter percentage of holes:`));
  
      this.setup.fieldHeigth = inputHeigth;
      this.setup.fieldWidth = inputWidth;
      this.setup.holePercentage = holePercentage;
  
      this.setup.setValidField();
      this.currentPosition = this.initialPosition;
      this.logInstructions();
      this.print();
      this.move();
  
    }
  
    print() {
      this.setup.field.forEach(row => console.log(row.join(``)));
    }

    logInstructions() {
      console.log(`\nYou lost your hat in a field with holes!`);
      console.log(`Use the 'a', 'w', 'd' and 's' keys to navigate the field until you reach it.`);
      console.log(`'a' goes left, 'w' goes up, 'd' goes right and 's' goes down.`);
    }
    
    move() {
      const moves = {
        up: 'w',
        down:'s',
        left:'a',
        right:'d'
      };
      
      const targetPosition = {
        i: 0,
        j: 0
      }
      
      const direction = this.askNextMove(); 
      
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
      
      if (!this.setup.field[targetPosition.i] || !this.setup.field[targetPosition.i][targetPosition.j]) {
        console.log('Oh no! You fell of the field! GAME OVER!')
        this.willYouReplay();
        return;
      };
      
      const target = this.setup.field[targetPosition.i][targetPosition.j];
      
      if (target === this.setup.hole.character) {
        console.log('Oh no! You fell in a hole! GAME OVER!')
        this.willYouReplay();
        return;
      };
      
      if (target === this.setup.hat.character) {
        console.log('Congratulations! You found your hat!');
        
        if (this.setup.field.equals(this.setup.bestSolutionField)) {
          console.log('Additionally, you took the shortest possible path! You must be really smart :)');
        };
        
        this.willYouReplay();
        return;
      };
      
      if (target === this.setup.emptyField.character) {
        this.setup._field[targetPosition.i].splice(targetPosition.j, 1, this.setup.path.character);
        // this._field[this._currentPosition.i].splice(this._currentPosition.j, 1, emptyFieldCharacter);
        this.currentPosition = targetPosition;
        
        this.print();
        this.move();
      };
    }
    
    askNextMove() {
      let moveDirection = this.prompt('Which way would you like to go?');
      moveDirection = moveDirection.toLowerCase();
  
      return moveDirection;
    }
  
    willYouReplay() {
      let restart = this.prompt("Start Again? Type 'y' to start over or 'n' to exit.");
      restart = restart.toLowerCase();
  
  
      restart === 'y' ? this.play() :
      restart === 'n' ? console.log(`Bye! Thanks for playing!`) :
      willYouReplay();
  
    }
  };

  module.exports = Game;