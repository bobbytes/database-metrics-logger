export const convertStringToNumber = (values: [] | {}): [] | {} => {
  const stringValue = JSON.stringify(values);
  return JSON.parse(stringValue, (_key, value) =>
    typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value);
};

export const toPercentage = (value: number, maxValue: number): number => {
  const percentage = (value * 100) / maxValue;
  return parseFloat((percentage).toFixed(2));
};
