export const getFromObjectPath = (obj: {}, path: string, defaultValue?: any) => path
  .split('.')
  .reduce((accumulator, currentValue) =>
    (accumulator && accumulator[currentValue] ? accumulator[currentValue] : (defaultValue || undefined)), obj);
