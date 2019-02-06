import { CloudFoundryConnector } from '../../../../src/modules/connectors/cloud-foundry-connector';
import { vcap } from '../../data/vcap';

describe('CloudFoundryConnector', () => {
  let cloudFoundryConnector: CloudFoundryConnector;

  beforeEach(() => {
    cloudFoundryConnector = new CloudFoundryConnector({ vcap });
  });

  test('bubu', () => {
    expect(cloudFoundryConnector).toBeInstanceOf(CloudFoundryConnector);

    cloudFoundryConnector.getCredentials();
  });

  /*
  test('getServicesCredentialsByServiceType must return an array all of service credentials by service type mongodb-2', () => {
    expect(cloudFoundryConnector).toBeInstanceOf(CloudFoundryConnector);

    const serviceCredentials = cloudFoundryConnector.getServicesCredentialsByServiceType(CloudFoundryServiceType.MongoDb);
    const expectedServiceCredentials = vcapTestJson.services[CloudFoundryServiceType.MongoDb].map(service => service.credentials);

    expect(serviceCredentials).toEqual(expectedServiceCredentials);
  });

  test('getServicesCredentialsByServiceType must return an array all of service credentials by service type redis-2', () => {
    expect(cloudFoundryConnector).toBeInstanceOf(CloudFoundryConnector);

    const serviceCredentials = cloudFoundryConnector.getServicesCredentialsByServiceType(CloudFoundryServiceType.Redis);
    const expectedServiceCredentials = vcapTestJson.services[CloudFoundryServiceType.Redis].map(service => service.credentials);

    expect(serviceCredentials).toEqual(expectedServiceCredentials);
  });

  test('getServicesCredentialsByServiceType must return an empty array if no credentials are found', () => {
    expect(cloudFoundryConnector).toBeInstanceOf(CloudFoundryConnector);

    const serviceCredentials = cloudFoundryConnector.getServicesCredentialsByServiceType('test-service' as CloudFoundryServiceType);

    expect(serviceCredentials).toEqual([]);
  });

  test('getServicesCredentialsByServiceType must return an empty array if no vcap configuration is found', () => {
    const cloudFoundryNoServices = new CloudFoundryConnector({ vcap: {} });

    const mongoDbServiceCredentials = cloudFoundryNoServices.getServicesCredentialsByServiceType(CloudFoundryServiceType.MongoDb);
    const redisServiceCredentials = cloudFoundryNoServices.getServicesCredentialsByServiceType(CloudFoundryServiceType.Redis);

    expect(mongoDbServiceCredentials).toEqual([]);
    expect(redisServiceCredentials).toEqual([]);
  });
  */
});
