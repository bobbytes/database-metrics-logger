import {
    CloudFoundryServiceType
} from '../../../../src/modules/connectors/cloud-foundry-connector';
import {
    serviceTypeDatabaseTypeMapper
} from '../../../../src/modules/connectors/cloud-foundry-connector/mappers/service-types.mapper';
import { vcap } from './vcap';

const mongoDbService = vcap.services[CloudFoundryServiceType.MongoDb2][0];
const mongoDbCredentials = mongoDbService.credentials;

const redisService = vcap.services[CloudFoundryServiceType.Redis2][0];
const redisCredentials = redisService.credentials;

export const expectedCredentials = [
  {
    databaseType: serviceTypeDatabaseTypeMapper.get(mongoDbService.label as CloudFoundryServiceType),
    host: mongoDbCredentials.host,
    uri: mongoDbCredentials.database_uri,
    username: mongoDbCredentials.username,
    password: mongoDbCredentials.password,
    database: mongoDbCredentials.database,
  },
  {
    databaseType: serviceTypeDatabaseTypeMapper.get(redisService.label as CloudFoundryServiceType),
    host: redisCredentials.host,
    port: redisCredentials.port,
    password: redisCredentials.password,
  },
];
