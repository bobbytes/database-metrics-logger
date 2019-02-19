export const convertStringToNumber = (values: [] | {}): [] | {} => {
  const stringValue = JSON.stringify(values);
  return JSON.parse(stringValue, (_key, value) =>
    typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value);
};
