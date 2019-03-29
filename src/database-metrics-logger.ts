import { logger } from './helpers/logger';
import { mergeDeep } from './helpers/merge-deep';
import { PubSub } from './helpers/pub-sub';
import { MongodbMetrics } from './modules/database-metrics/mongodb-metrics';
import { RedisMetrics } from './modules/database-metrics/redis-metrics';
import { ITransportInterface } from './modules/transports/transport-interface';

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

export interface IDatabaseMetricsLoggerConfig {
  databaseCredentials: IDatabaseCredentials[];
  transports?: ITransportInterface[];
}

export class DatabaseMetricsLogger extends PubSub {
  private databaseCredentials: IDatabaseCredentials[];
  private dbMetricsCollection: (MongodbMetrics | RedisMetrics)[] = [];
  private transports: ITransportInterface[];

  constructor(config: IDatabaseMetricsLoggerConfig) {
    super();
    this.databaseCredentials = config.databaseCredentials.map(this.mapDefaultValues);
    this.transports = config.transports = [];
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

      databaseMetrics.getMetrics().subscribe(undefined, metrics => {
        this.publish(DatabaseMetricsEvent.Metrics, metrics);
        this.executeTransports(metrics);
      });

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

  private executeTransports(metrics: any): void {
    if (this.transports) {
      this.transports.forEach(transport => transport.postMetrics(metrics));
    }
  }
}
