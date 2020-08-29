const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const emptyFieldCharacter = '░';
const pathCharacter = '*';

const direction = prompt('Which way would you like to go?');


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
console.log(newField.field);
newField.print();
