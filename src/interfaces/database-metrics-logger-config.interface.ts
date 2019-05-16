import { ITransportInterface } from '../modules/transports/interfaces/transport-interface';
import { IDatabaseCredentials } from './database-credentials.interface';

export interface IDatabaseMetricsLoggerConfig {
  databaseCredentials: IDatabaseCredentials[];
  transports?: ITransportInterface[];
}
