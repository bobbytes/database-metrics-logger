import { CloudFoundryConnector } from '../../../../src/modules/connectors/cloud-foundry-connector';
import {
    expectedCredentials
} from '../../data/cloud-foundry-connector/expected-database-credentials';
import { vcap } from '../../data/cloud-foundry-connector/vcap';

describe('CloudFoundryConnector', () => {
  test('getCredentials must return an mapped array of database credentials', () => {
    const cloudFoundryConnector = new CloudFoundryConnector({ vcap });

    const credentials = cloudFoundryConnector.getCredentials();

    expect(credentials).toEqual(expectedCredentials);
  });

  test('getCredentials must return an empty array if there are no services bound to cloud foundry application', () => {
    const cloudFoundryConnector = new CloudFoundryConnector();

    const credentials = cloudFoundryConnector.getCredentials();

    expect(credentials).toEqual([]);
  });
});
