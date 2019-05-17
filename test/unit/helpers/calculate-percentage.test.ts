import { calculatePercentage } from '../../../src/helpers/converters';

describe('calculatePercentage', () => {
  test('must convert simple value to percentage', () => {
    const value = 4;
    const maxValue = 100;
    const percentage = calculatePercentage(value, maxValue);

    expect(percentage).toEqual(4);
  });

  test('must calculate value to percentage rounded by two decimals', () => {
    const value = 4;
    const maxValue = 44;
    const percentage = calculatePercentage(value, maxValue);

    expect(percentage).toEqual(9.09);
  });
});
