import { CloudFoundry, ServiceType } from '../../../src/classes/cloud-foundry';
import vcapTestJson from '../../../vcap.test.json';

describe.skip('CloudFoundry', () => {
  let cloudFoundry: CloudFoundry;

  beforeEach(() => {
    cloudFoundry = new CloudFoundry();
  });

  test('getServicesCredentialsByServiceType must return an array all of service credentials by service type mongodb-2', () => {
    expect(cloudFoundry).toBeInstanceOf(CloudFoundry);

    const serviceCredentials = cloudFoundry.getServicesCredentialsByServiceType(ServiceType.MongoDb);
    const expectedServiceCredentials = vcapTestJson.services[ServiceType.MongoDb].map(service => service.credentials);

    expect(serviceCredentials).toEqual(expectedServiceCredentials);
  });

  test('getServicesCredentialsByServiceType must return an array all of service credentials by service type redis-2', () => {
    expect(cloudFoundry).toBeInstanceOf(CloudFoundry);

    const serviceCredentials = cloudFoundry.getServicesCredentialsByServiceType(ServiceType.Redis);
    const expectedServiceCredentials = vcapTestJson.services[ServiceType.Redis].map(service => service.credentials);

    expect(serviceCredentials).toEqual(expectedServiceCredentials);
  });

  test('getServicesCredentialsByServiceType must return an empty array if no credentials are found', () => {
    expect(cloudFoundry).toBeInstanceOf(CloudFoundry);

    const serviceCredentials = cloudFoundry.getServicesCredentialsByServiceType('test-service' as ServiceType);

    expect(serviceCredentials).toEqual([]);
  });

  test('getServicesCredentialsByServiceType must return an empty array if no vcap configuration is found', () => {
    const cloudFoundryNoServices = new CloudFoundry({ vcap: {} });

    const mongoDbServiceCredentials = cloudFoundryNoServices.getServicesCredentialsByServiceType(ServiceType.MongoDb);
    const redisServiceCredentials = cloudFoundryNoServices.getServicesCredentialsByServiceType(ServiceType.Redis);

    expect(mongoDbServiceCredentials).toEqual([]);
    expect(redisServiceCredentials).toEqual([]);
  });
});
