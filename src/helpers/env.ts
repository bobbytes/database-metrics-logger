// this is a workaround due to typescript compiler which copies package.json to output directory
// tslint:disable-next-line:no-var-requires
const pkg = require('../../package.json');

const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test';
};

/**
 * Environment variables
 */
export const env = {
  app: {
    name: pkg.name,
    version: pkg.version,
    majorVersion: pkg.version.split('.')[0],
    isTest: isTest(),
  },
};
