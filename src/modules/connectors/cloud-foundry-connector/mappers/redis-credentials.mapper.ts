import * as cfenv from 'cfenv';

import { IDatabaseCredentials } from '../../../../database-metrics-logger';
import { CloudFoundryServiceType } from '../enums';
import { serviceTypeDatabaseTypeMapper } from './service-types.mapper';

export const mapRedisCredentials = (cloudFoundryCredentials: cfenv.IRedisCredentials): IDatabaseCredentials => {
  return {
    databaseType: serviceTypeDatabaseTypeMapper.get(CloudFoundryServiceType.Redis2),
    host: cloudFoundryCredentials.host,
    port: cloudFoundryCredentials.port,
    password: cloudFoundryCredentials.password,
  };
};
