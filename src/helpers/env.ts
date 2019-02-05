import * as path from 'path';

// this is a workaround due to typescript compiler which copies package.json to output directory
// tslint:disable-next-line:no-var-requires
const pkg = require(path.join(process.cwd(), 'package.json'));

export function getOsEnv(key: string): string {
  if (typeof process.env[key] === 'undefined') {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key] as string;
}

/**
 * Environment variables
 */
export const env = {
  app: {
    name: pkg.name,
    version: pkg.version,
    majorVersion: pkg.version.split('.')[0],
    nodeEnv: getOsEnv('NODE_ENV'),
  },
};
