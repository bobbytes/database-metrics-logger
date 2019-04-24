import { ITransportInterface } from '../modules/transports/transport-interface';
import { IDatabaseCredentials } from './database-credentials.interface';

export interface IDatabaseMetricsLoggerConfig {
  databaseCredentials: IDatabaseCredentials[];
  transports?: ITransportInterface[];
}
