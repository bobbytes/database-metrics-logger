import * as cfenv from 'cfenv';

import { DatabaseType, IDatabaseCredentials } from '../../../database-metrics-logger';
import { logger } from '../../../helpers/logger';
import { CloudFoundryServiceType } from './enums';
import { mapMongoDbCredentials } from './mappers/mongo-db-credentials.mapper';
import { mapRedisCredentials } from './mappers/redis-credentials.mapper';
import { serviceTypeDatabaseTypeMapper } from './mappers/service-types.mapper';

export interface ICloudFoundryOptions {
  vcap?: {};
  vcapFile?: string;
}

export class CloudFoundryConnector {
  private appEnvironment: cfenv.IAppEnv;

  constructor(
    options: ICloudFoundryOptions = {}
  ) {
    this.appEnvironment = cfenv.getAppEnv({ vcap: options.vcap, vcapFile: options.vcapFile });
  }

  public getCredentials(): IDatabaseCredentials[] {
    const cloudFoundryServices = this.getCloudFoundryServices();

    return cloudFoundryServices
      .filter(service => !!serviceTypeDatabaseTypeMapper.get(service.label as CloudFoundryServiceType))
      .map(service => this.mapCloudFoundryCredentials(service.label as CloudFoundryServiceType, service.credentials));
  }

  private getCloudFoundryServices(): cfenv.IService[] {
    const services = this.appEnvironment.getServices();
    const serviceValues = Object.keys(services).map(key => services[key]);

    if (!serviceValues.length) {
      logger.info('no bound services found');
    }

    return serviceValues;
  }

  private mapCloudFoundryCredentials(serviceType: CloudFoundryServiceType, cloudFoundryCredentials: cfenv.TCredentials): IDatabaseCredentials | undefined {
    const databaseType = serviceTypeDatabaseTypeMapper.get(serviceType);

    switch (databaseType) {
      case DatabaseType.MongoDb:
        return mapMongoDbCredentials(cloudFoundryCredentials as cfenv.IMongoDbCredentials);
      case DatabaseType.Redis:
        return mapRedisCredentials(cloudFoundryCredentials as cfenv.IRedisCredentials);
      default:
        return;
    }
  }
}
