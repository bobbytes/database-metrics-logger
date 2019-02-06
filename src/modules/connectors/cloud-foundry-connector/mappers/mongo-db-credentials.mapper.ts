import * as cfenv from 'cfenv';

import { IDatabaseCredentials } from '../../../../database-metrics-logger';
import { CloudFoundryServiceType } from '../enums';
import { serviceTypeDatabaseTypeMapper } from './service-types.mapper';

export const mapMongoDbCredentials = (cloudFoundryCredentials: cfenv.IMongoDbCredentials): IDatabaseCredentials => {
  return {
    databaseType: serviceTypeDatabaseTypeMapper.get(CloudFoundryServiceType.MongoDb2),
    host: cloudFoundryCredentials.host,
    uri: cloudFoundryCredentials.database_uri,
    username: cloudFoundryCredentials.username,
    password: cloudFoundryCredentials.password,
    database: cloudFoundryCredentials.database,
  };
};
