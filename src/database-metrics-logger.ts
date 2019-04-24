import { DatabaseMetricsEvent } from './enums';
import { DatabaseType } from './enums/database-type.enum';
import { logger } from './helpers/logger';
import { mergeDeep } from './helpers/merge-deep';
import { PubSub } from './helpers/pub-sub';
import { IDatabaseCredentials } from './interfaces/database-credentials.interface';
import {
    IDatabaseMetricsLoggerConfig
} from './interfaces/database-metrics-logger-config.interface';
import { MongoDbAgent } from './modules/database-metrics/mongodb/agent';
import { RedisAgent } from './modules/database-metrics/redis/agent';
import { ITransportInterface } from './modules/transports/transport-interface';

const defaultOptions = {
  interval: 10000,
};

export class DatabaseMetricsLogger extends PubSub {
  private databaseCredentials: IDatabaseCredentials[];
  private dbMetricsAgents: (MongoDbAgent | RedisAgent)[] = [];
  private transports: ITransportInterface[];

  constructor(config: IDatabaseMetricsLoggerConfig) {
    super();
    this.databaseCredentials = config.databaseCredentials.map(this.mapDefaultValues.bind(this));
    this.transports = config.transports || [];
  }

  public start(): void {
    logger.subscribe(undefined, value => this.publish(DatabaseMetricsEvent.Logs, value));

    this.databaseCredentials.forEach(credentials => {
      const agent = this.getDatabaseMetricsAgent(credentials);

      if (agent) {
        agent.getMetrics().subscribe(undefined, metrics => {
          this.publish(DatabaseMetricsEvent.Metrics, metrics);
          this.executeTransports(metrics);
        });

        this.dbMetricsAgents.push(agent);
      }
    });
  }

  public stop(): void {
    this.unsubscribeAll();
    this.dbMetricsAgents.forEach(agent => agent.stop());
    this.dbMetricsAgents = [];
    logger.unsubscribeAll();
  }

  private getDatabaseMetricsAgent(credentials: IDatabaseCredentials): any {
    switch (credentials.databaseType) {
      case DatabaseType.Mongodb:
        return new MongoDbAgent(credentials);
      case DatabaseType.Redis:
        return new RedisAgent(credentials);
      default:
        return undefined;
    }
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
