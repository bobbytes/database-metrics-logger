import { env } from '../../../src/helpers/env';
import pkg from '../../../package.json';

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

  test('isTest must be truthy', () => {
    expect(env.app.isTest).toBeTruthy();
  });
});
