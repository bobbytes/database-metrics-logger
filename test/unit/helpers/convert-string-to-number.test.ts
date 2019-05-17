import { convertStringToNumber } from '../../../src/helpers/converters';

describe('convertStringToNumber', () => {
  const valuesToConvert = {
    manufacturer: 'tesla',
    seats: '5',
    driver: {
      name: 'jon',
      age: '44',
    },
  };

  const expectedValues = {
    manufacturer: 'tesla',
    seats: 5,
    driver: {
      name: 'jon',
      age: 44,
    },
  };

  test('must convert string values to numbers from an object', () => {
    const convertedValues = convertStringToNumber(valuesToConvert);

    expect(convertedValues).toEqual(expectedValues);
  });

  test('must convert string values to numbers in an array', () => {
    const valuesToConvertArray = ['tesla', '5', 'jon', 'age', '44'];
    const expectedValuesArray = ['tesla', 5, 'jon', 'age', 44];

    const convertedValues = convertStringToNumber(valuesToConvertArray);

    expect(convertedValues).toEqual(expectedValuesArray);
  });

  test('must convert string values to numbers from an object in an array', () => {
    const valuesToConvertArray = [valuesToConvert];
    const expectedValuesArray = [expectedValues];

    const convertedValues = convertStringToNumber(valuesToConvertArray);

    expect(convertedValues).toEqual(expectedValuesArray);
  });

  test('must convert string value to number', () => {
    const convertedValue = convertStringToNumber('44');

    expect(convertedValue).toEqual(44);
  });

  test('must not convert isNaN value to number', () => {
    const manufacturer = '1 tesla';
    const convertedValue = convertStringToNumber(manufacturer);

    expect(convertedValue).toEqual(manufacturer);
  });
});
