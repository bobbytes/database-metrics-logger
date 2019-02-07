import {
    CloudFoundryServiceType
} from '../../../../src/modules/connectors/cloud-foundry-connector';
import {
    serviceTypeDatabaseTypeMapper
} from '../../../../src/modules/connectors/cloud-foundry-connector/mappers/service-types.mapper';
import { vcap } from './vcap';

const mongodbService = vcap.services[CloudFoundryServiceType.Mongodb2][0];
const mongodbCredentials = mongodbService.credentials;

const redisService = vcap.services[CloudFoundryServiceType.Redis2][0];
const redisCredentials = redisService.credentials;

export const expectedCredentials = [
  {
    databaseType: serviceTypeDatabaseTypeMapper.get(mongodbService.label as CloudFoundryServiceType),
    host: mongodbCredentials.host,
    uri: mongodbCredentials.database_uri,
    username: mongodbCredentials.username,
    password: mongodbCredentials.password,
    database: mongodbCredentials.database,
  },
  {
    databaseType: serviceTypeDatabaseTypeMapper.get(redisService.label as CloudFoundryServiceType),
    host: redisCredentials.host,
    port: redisCredentials.port,
    password: redisCredentials.password,
  },
];
