import { CloudFoundry, ServiceType } from '../../../src/classes/cloud-foundry';
import vcapTestJson from '../../../vcap.test.json';

describe('CloudFoundry', () => {
  let cloudFoundry: CloudFoundry;

  beforeEach(() => {
    cloudFoundry = new CloudFoundry();
  });

  test('must return an array all of service credentials by service type mongodb-2', () => {
    expect(cloudFoundry).toBeInstanceOf(CloudFoundry);

    const serviceCredentials = cloudFoundry.getServicesCredentialsByServiceType(ServiceType.MongoDb);
    const expectedServiceCredentials = vcapTestJson.services[ServiceType.MongoDb].map(service => service.credentials);

    expect(serviceCredentials).toEqual(expectedServiceCredentials);
  });

  test('must return an array all of service credentials by service type redis-2', () => {
    expect(cloudFoundry).toBeInstanceOf(CloudFoundry);

    const serviceCredentials = cloudFoundry.getServicesCredentialsByServiceType(ServiceType.Redis);
    const expectedServiceCredentials = vcapTestJson.services[ServiceType.Redis].map(service => service.credentials);

    expect(serviceCredentials).toEqual(expectedServiceCredentials);
  });
});
