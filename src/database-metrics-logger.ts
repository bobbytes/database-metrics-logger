import { logger } from './helpers/logger';
import { mergeDeep } from './helpers/merge-deep';
import { PubSub } from './helpers/pub-sub';
import { MongodbMetrics } from './modules/database-metrics/mongodb-metrics';
import { RedisMetrics } from './modules/database-metrics/redis-metrics';

const defaultOptions = {
  interval: 10000,
};

export enum DatabaseMetricsEvent {
  Metrics = 'metrics',
  Logs = 'logs',
}

export enum DatabaseType {
  Mongodb = 'mongodb',
  Redis = 'redis',
}

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

export class DatabaseMetricsLogger extends PubSub {
  private databaseCredentials: IDatabaseCredentials[];
  private dbMetricsCollection: (MongodbMetrics | RedisMetrics)[] = [];

  constructor(
    databaseCredentials: IDatabaseCredentials[] = []
  ) {
    super();
    this.databaseCredentials = databaseCredentials.map(this.mapDefaultValues);
  }

  public start(): void {
    logger.subscribe(undefined, value => this.publish(DatabaseMetricsEvent.Logs, value));

    this.databaseCredentials.forEach(credentials => {
      let databaseMetrics: any;

      switch (credentials.databaseType) {
        case DatabaseType.Mongodb:
          databaseMetrics = new MongodbMetrics(credentials);
          break;
        case DatabaseType.Redis:
          databaseMetrics = new RedisMetrics(credentials);
          break;
        default:
          break;
      }

      databaseMetrics.getMetrics().subscribe(undefined, metrics =>
        this.publish(DatabaseMetricsEvent.Metrics, metrics));

      this.dbMetricsCollection.push(databaseMetrics);
    });
  }

  public stop(): void {
    this.unsubscribeAll();
    this.dbMetricsCollection.forEach(dbMetrics => dbMetrics.stop());
    this.dbMetricsCollection = [];
    logger.unsubscribeAll();
  }

  private mapDefaultValues(serviceCredential: IDatabaseCredentials): IDatabaseCredentials {
    serviceCredential.name = serviceCredential.name || serviceCredential.host;
    return mergeDeep({}, defaultOptions, serviceCredential) as IDatabaseCredentials;
  }
}
