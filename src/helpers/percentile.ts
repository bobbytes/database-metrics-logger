const sortValues = values => values.sort((valueA, valueB) => {
  if (valueA === valueB) {
    return 0;
  }

  return valueA > valueB ? 1 : -1;
});

export const calculatePercentile = (percentile: number, values: number[]): number => {
  if (!values.length) {
    return;
  }

  const sortedValues = sortValues(values);

  if (percentile === 0) {
    return sortedValues[0];
  }

  const percentileIndex = Math.ceil(sortedValues.length * (percentile / 100)) - 1;
  return sortedValues[percentileIndex];
};
