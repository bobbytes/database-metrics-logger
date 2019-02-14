import * as cfenv from 'cfenv';

import { IDatabaseCredentials } from '../../../../database-metrics-logger';
import { CloudFoundryServiceType } from '../enums';
import { serviceTypeDatabaseTypeMapper } from './service-types.mapper';

export const mapRedisCredentials = (cloudFoundryService: cfenv.IService): IDatabaseCredentials => {
  const credentials = cloudFoundryService.credentials as cfenv.IRedisCredentials;

  return {
    databaseType: serviceTypeDatabaseTypeMapper.get(CloudFoundryServiceType.Redis2),
    name: cloudFoundryService.name,
    host: credentials.host,
    port: credentials.port,
    password: credentials.password,
  };
};
