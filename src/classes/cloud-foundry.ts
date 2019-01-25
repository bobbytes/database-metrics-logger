import * as cfenv from 'cfenv';
import * as path from 'path';

export enum ServiceType {
  MongoDb = 'mongodb-2',
  Redis = 'redis-2',
}

export class CloudFoundry {
  private appEnvironment = cfenv.getAppEnv({ vcapFile: path.join(__dirname, '../vcap.json') });

  public getServicesCredentialsByServiceType(serviceType: ServiceType): cfenv.TCredentials[] {
    const services = this.getServicesByServiceType(serviceType);
    const serviceNames = services.map(service => service.name);

    return serviceNames.map(serviceName => this.appEnvironment.getServiceCreds(serviceName));
  }

  private getServices(): cfenv.IService[] {
    const services = this.appEnvironment.getServices();
    const serviceValues = Object.keys(services).map(key => services[key]);

    if (!serviceValues.length) {
      // this.logger.error('no bound services found');
    }

    return serviceValues;
  }

  private getServicesByServiceType(serviceType: ServiceType): cfenv.IService[] {
    const services = this.getServices();

    const servicesByServiceType = services.filter(service => service.label === serviceType);

    if (services.length && !servicesByServiceType.length) {
      // this.logger.error(`no bound services for service type ${serviceType} found`);
    }

    return servicesByServiceType;
  }
}
