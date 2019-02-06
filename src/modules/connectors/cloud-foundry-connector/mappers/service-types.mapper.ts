import { DatabaseType } from '../../../../database-metrics-logger';
import { CloudFoundryServiceType } from '../enums';

export const serviceTypeDatabaseTypeMapper = new Map<CloudFoundryServiceType, DatabaseType>();

serviceTypeDatabaseTypeMapper.set(CloudFoundryServiceType.MongoDb2, DatabaseType.MongoDb);
serviceTypeDatabaseTypeMapper.set(CloudFoundryServiceType.Redis2, DatabaseType.Redis);
