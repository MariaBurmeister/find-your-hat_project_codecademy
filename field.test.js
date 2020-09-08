const { Field } = require('./main')

const hat = '^';
const hole = 'O';
const emptyField = '░';
const path = '*';

test('Field existe', () => {
  const fieldInstance = new Field();

  expect(fieldInstance).toBeDefined();
});

test('Field: isFieldValid', () => {
    const fieldInstance = new Field();
    // const field = fieldInstance.generateField(5, 5, 10);

    const invalidField = [
      [path, hole, hat],
      [hole, hole, emptyField],
      [emptyField, emptyField, emptyField,]
    ]

    expect(fieldInstance.isFieldValid(invalidField)).toBe(false);
})

test('Field: isFieldValid', () => {
    const fieldInstance = new Field();
    // const field = fieldInstance.generateField(5, 5, 10);

    const validField = [
      [path, emptyField, hat],
      [hole, hole, emptyField],
      [emptyField, emptyField, emptyField,]
    ]

    expect(fieldInstance.isFieldValid(validField)).toBe(true);
})
