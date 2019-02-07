import pkg from '../../../package.json';
import { env } from '../../../src/helpers/env';

describe('env', () => {
  test('package name must be set', () => {
    expect(env.app.name).toEqual(pkg.name);
  });

  test('package version must be set', () => {
    expect(env.app.version).toEqual(pkg.version);
  });

  test('package major version must be set', () => {
    expect(env.app.majorVersion).toEqual(pkg.version.split('.')[0]);
  });

  test('nodeEnv must be equal test', () => {
    expect(env.app.nodeEnv).toEqual('test');
  });
});
