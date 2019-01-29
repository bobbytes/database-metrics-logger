import { mergeDeep } from '../../../src/helpers/merge-deep';

describe('mergeDeep', () => {
  test('must return an empty object if both objects are empty', () => {
    const defaultOptions = {};
    const options = {};
    const mergedOptions = mergeDeep({}, defaultOptions, options);
    const expectedOptions = {};

    expect(mergedOptions).toEqual(expectedOptions);
  });

  test('must return empty object if one object is empty and the other undefined', () => {
    const defaultOptions = {};
    const options = undefined;
    const mergedOptions = mergeDeep({}, defaultOptions, options);
    const expectedOptions = {};

    expect(mergedOptions).toEqual(expectedOptions);
  });

  test('must return empty object if both objects are undefined', () => {
    const defaultOptions = undefined;
    const options = undefined;
    const mergedOptions = mergeDeep({}, defaultOptions, options);
    const expectedOptions = {};

    expect(mergedOptions).toEqual(expectedOptions);
  });

  test('must return default options if options is undefined', () => {
    const defaultOptions = {
      color: 'purple',
      car: {
        model: 'model x',
        manufacturer: 'tesla',
      },
    };

    const options = undefined;
    const mergedOptions = mergeDeep({}, defaultOptions, options);

    expect(mergedOptions).toEqual(defaultOptions);
  });

  test('must return options if default options is undefined', () => {
    const defaultOptions = undefined;

    const options = {
      color: 'purple',
      car: {
        model: 'model x',
        manufacturer: 'tesla',
      },
    };

    const mergedOptions = mergeDeep({}, defaultOptions, options);

    expect(mergedOptions).toEqual(options);
  });

  test('must override all default options', () => {
    const defaultOptions = {
      color: 'purple',
      car: {
        model: 'model x',
        manufacturer: 'tesla',
      },
    };

    const options = {
      color: 'black',
      car: {
        model: 'Camaro',
        manufacturer: 'Chevrolet',
      },
    };

    const mergedOptions = mergeDeep({}, defaultOptions, options);

    expect(mergedOptions).toEqual(options);
  });

  test('must override only one option', () => {
    const defaultOptions = {
      color: 'purple',
      car: {
        model: 'model x',
        manufacturer: 'tesla',
      },
    };

    const options = {
      color: 'black',
    };

    const expectedOptions = {
      color: 'black',
      car: {
        model: 'model x',
        manufacturer: 'tesla',
      },
    };

    const mergedOptions = mergeDeep({}, defaultOptions, options);

    expect(mergedOptions).toEqual(expectedOptions);
  });

  test('must override only one deep option', () => {
    const defaultOptions = {
      color: 'purple',
      car: {
        model: 'model x',
        manufacturer: 'tesla',
      },
    };

    const options = {
      car: {
        model: 'model s',
      },
    };

    const expectedOptions = {
      color: 'purple',
      car: {
        model: 'model s',
        manufacturer: 'tesla',
      },
    };

    const mergedOptions = mergeDeep({}, defaultOptions, options);

    expect(mergedOptions).toEqual(expectedOptions);
  });
});
