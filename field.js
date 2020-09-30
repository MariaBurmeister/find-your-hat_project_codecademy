
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

class Elements {
  constructor() {
    this.hat = {
      character : '^',
      position : {
        i:0,
        j:0
      }
    };
    this.path = {
        character : '*',
        position : {
          i:0,
          j:0
        }
      };
    this.hole = {
        character : 'O'
      };
    this.emptyField = {
        character : '░'
      };
}
}

class Setup {
    constructor(elements) {
      this._field = [];
      this.fieldHeigth = 0;
      this.fieldWidth = 0;
      this.holePercentage = 0;

      this.hat = elements.hat;
      this.path = elements.path;
      this.hole = elements.hole;
      this.emptyField = elements.emptyField;

      this._bestSolutionField = [];
    }
  
    get field() {
      return this._field;
    }
  
    get pathPosition() {
      return this.path.position;
    }
  
    get hatPosition() {
      return this.hat.position;
    }
  
    get bestSolutionField() {
      return this._bestSolutionField;
    }
    
    findSingleComponentPosition(field, component) {
      field.forEach((row, rowIndex) => {
        const indexOfComponentInRow = row.indexOf(component.character);
  
        if (indexOfComponentInRow !== -1) {
          component.position.j = indexOfComponentInRow;
          component.position.i = rowIndex;
        };
      });
    }
    
    setValidField() {
      const candidateField = 
      this.generateCandidateField();
  
      const fieldIsValid = 
      this.isFieldValid(candidateField);
  
      if (fieldIsValid) {
        this._field = candidateField;
      } else {
        this.setValidField();
      };
    }
    
    generateCandidateField() {
    
      const orderedComponents = 
      this.setFieldComponents();
  
      const shuffledComponents = 
      this.shuffleFieldComponents(orderedComponents);
  
      const candidateField = 
      this.formatField(shuffledComponents);
  
      this.findSingleComponentPosition(candidateField, this.hat.character);
      this.findSingleComponentPosition(candidateField, this.path.character);
  
      return candidateField;
    }
    
    setFieldComponents() {
      const numberOfSlotsToFill =
      this.fieldHeigth * this.fieldWidth;
  
      const numberToFillWithHoles =
      numberOfSlotsToFill * this.holePercentage/100;
  
      const numberToFillWithEmpties =
      numberOfSlotsToFill - numberToFillWithHoles -2;
  
      const orderedComponents = [];
 
      for (let i=0; i < numberOfSlotsToFill; i++) {
        i < numberToFillWithHoles ?
        orderedComponents.push(this.hole.character) :
        i < numberToFillWithHoles + numberToFillWithEmpties ?
        orderedComponents.push(this.emptyField.character) :
        i < numberOfSlotsToFill -1 ?
        orderedComponents.push(this.hat.character) :
        orderedComponents.push(this.path.character);
      };
  
      return orderedComponents;
    }
  
    shuffleFieldComponents(arrayOfComponents) {
      for (let j= arrayOfComponents.length -1; j > 0; j--) {
        const randomIndex =
        Math.floor(Math.random()*arrayOfComponents.length);
  
        const lastElement = arrayOfComponents[j];
        arrayOfComponents[j] = arrayOfComponents[randomIndex];
        arrayOfComponents[randomIndex] = lastElement;
      };
  
      const shuffledComponents = arrayOfComponents.map(component => component);
  
      return shuffledComponents;
    }
  
    formatField(shuffledComponents) {
      const candidateField = [];
      let indexPace = 0;
      for (let k=0; k < this.fieldHeigth; k++) {
        const newRow = shuffledComponents.slice(indexPace, indexPace + this.fieldWidth);
        indexPace += this.fieldWidth;
        candidateField.push(newRow);
      };
  
      return candidateField;
    }
  
    isFieldValid(field) {
  
      const cloneField = field.map(row => row.map(spot => spot));
  
  
      const bestSolution = [];
      const bestSolutionField = field.map(row => row.map(spot => spot));
  
      const openSet = [];
      const closedSet = [];
  
      let initialSpot = {};
      let hatSpot = {};
  
      cloneField.forEach((row, iIndex, array) => {
        row.forEach((spot, jIndex) => {
          array[iIndex][jIndex] = new Spot(iIndex, jIndex, spot, this.hatPosition, new Elements());
  
          if (spot === this.path.character) {
            initialSpot = array[iIndex][jIndex];
          } else if (spot === this.hat.character) {
            hatSpot = array[iIndex][jIndex];
          };
        });
      });
  
      cloneField.forEach((row, iIndex, array) => {
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
            let pushToSolution = currentSpot;
  
            while (pushToSolution.previous) {
              pushToSolution = pushToSolution.previous;
              bestSolution.push(pushToSolution);
            };
  
            bestSolution.forEach((pathSpot) => {
              bestSolutionField.forEach((row, rowIndex) => {
                if(rowIndex === pathSpot.i) {
                  row.forEach((spot, spotIndex) => {
                    if(spotIndex === pathSpot.j) {
                      row.splice(spotIndex, 1, this.path.character);
                    };
                  });
                };
              });
            });
            this._bestSolutionField = bestSolutionField;
            return true;
          }
  
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
                neighbour.previous = currentSpot;
                openSet.push(neighbour);
              };
            };
          });
        };
      };
      if(openSet.length <= 0) {
        return false;
      };
    }
  };

  class Spot {
    constructor(i, j, element, hatPosition, elements) {

    this.hat = elements.hat;
    this.path = elements.path;
    this.hole = elements.hole;
    this.emptyField = elements.emptyField;

    this.i = i;
    this.j = j;
    this.element = element;

    this.distanceRun = 0;

    this.xDistanceToHat = hatPosition.i - this.i;
    this.yDistanceToHat = hatPosition.j - this.j;
    this.distanceToHat = Math.sqrt(this.xDistanceToHat**2 + this.yDistanceToHat**2);

    this.guessedTotalDistanceCost = this.guessTotalDistanceCost();

    this.previous = undefined;
    this.neighbours = [];
    }

    guessTotalDistanceCost() {
      this.guessedTotalDistanceCost = this.distanceRun + this.distanceToHat;
      return this.guessedTotalDistanceCost;
    }

    findNeighbours(field) {
      const i = this.i;
      const j = this.j;

      if(field[i+1] && field[i+1][j] && field[i+1][j].element === this.emptyField.character
      || field[i+1] && field[i+1][j] && field[i+1][j].element === this.hat.character) {
      this.neighbours.push(field[i+1][j]);
    };
      if(field[i-1] && field[i-1][j] && field[i-1][j].element === this.emptyField.character
      || field[i-1] && field[i-1][j] && field[i-1][j].element === this.hat.character) {
      this.neighbours.push(field[i -1][j]);
    };
      if(field[i] && field[i][j+1] && field[i][j+1].element === this.emptyField.character
      || field[i] && field[i][j+1] && field[i][j+1].element === this.hat.character) {
      this.neighbours.push(field[i][j +1]);
    };
      if(field[i] && field[i][j-1] && field[i][j-1].element === this.emptyField.character
      || field[i] && field[i][j-1] && field[i][j-1].element === this.hat.character) {
      this.neighbours.push(field[i][j -1]);
    };
    }
}

module.exports = { Setup, Elements };