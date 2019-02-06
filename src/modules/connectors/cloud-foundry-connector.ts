import * as cfenv from 'cfenv';
import * as path from 'path';

import { env } from '../../helpers/env';
import { logger } from '../../helpers/logger';

export enum CloudFoundryServiceType {
  MongoDb = 'mongodb-2',
  Redis = 'redis-2',
}

export interface ICloudFoundryOptions {
  vcap?: {};
  vcapFile?: string;
}

export class CloudFoundryConnector {
  private appEnvironment: cfenv.IAppEnv;

  constructor(options?: ICloudFoundryOptions) {
    const vcapFile = options && options.vcapFile ? options.vcapFile : this.getVcapFilePath();

    this.appEnvironment = options && options.vcap
      ? cfenv.getAppEnv({ vcap: options.vcap })
      : cfenv.getAppEnv({ vcapFile });
  }

  public getServicesCredentialsByServiceType(serviceType: CloudFoundryServiceType): cfenv.TCredentials[] {
    const services = this.getServicesByServiceType(serviceType);
    const serviceNames = services.map(service => service.name);

    return serviceNames.map(serviceName => this.appEnvironment.getServiceCreds(serviceName));
  }

  private getServices(): cfenv.IService[] {
    const services = this.appEnvironment.getServices();
    const serviceValues = Object.keys(services).map(key => services[key]);

    if (!serviceValues.length) {
      logger.info('no bound services found');
    }

    return serviceValues;
  }

  private getServicesByServiceType(serviceType: CloudFoundryServiceType): cfenv.IService[] {
    const services = this.getServices();

    const servicesByServiceType = services.filter(service => service.label === serviceType);

    if (services.length && !servicesByServiceType.length) {
      logger.info(`no bound services for service type ${serviceType} found`);
    }

    return servicesByServiceType;
  }

  private getVcapFilePath(): string {
    return path.join(process.cwd(), `vcap${env.app.nodeEnv ? '.' + env.app.nodeEnv : ''}.json`);
  }
}
