import { DatabaseType } from '../enums/database-type.enum';

export interface IDatabaseCredentials {
  databaseType: DatabaseType;
  name?: string;
  host?: string;
  port?: number;
  uri?: string;
  username?: string;
  password?: string;
  database?: string;
  interval?: number;
}
