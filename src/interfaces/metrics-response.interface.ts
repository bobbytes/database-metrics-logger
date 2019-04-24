import { DatabaseType } from '../enums';

export interface IMetricsResponse {
  databaseType: DatabaseType;
  name: string;
  metrics: {};
}
