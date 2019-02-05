import { IMongoDbCredentials, IRedisCredentials } from 'cfenv';

import { logger } from '../helpers/logger';
import { mergeDeep } from '../helpers/merge-deep';
import { PubSub } from '../helpers/pub-sub';
import { IServiceMetricsOptions } from '../interfaces/service-metrics-options.interface';
import { CloudFoundry, ServiceType } from './connectors/cloud-foundry';
import { MongoDbMetrics, MongoDbMetricsEvent } from './database-metrics/mongo-db-metrics';
import { RedisMetrics, RedisMetricsEvent } from './database-metrics/redis-metrics';

const defaultOptions = {
  mongoDB: {
    serverStatusInterval: 10000,
    dbStatsInterval: 10000,
  },
  redis: {
    infoInterval: 10000,
  },
};

export enum CfServiceMetricsEvent {
  Metrics = 'metrics',
  Logs = 'logs',
}

export class CfServiceMetricsLogger extends PubSub {
  private options: IServiceMetricsOptions;
  private cloudFoundry: CloudFoundry;
  private dbStatusCollection: (MongoDbMetrics | RedisMetrics)[] = [];

  constructor(
    options?: IServiceMetricsOptions
  ) {
    super();
    this.options = mergeDeep({}, defaultOptions, options);

    this.cloudFoundry = new CloudFoundry({
      vcap: options.vcap,
      vcapFile: options.vcapFile,
    });
  }

  public start(): void {
    logger.subscribe(undefined, value => this.publish(CfServiceMetricsEvent.Logs, value));
    this.startMongoDbLogging();
    this.startRedisLogging();
  }

  public stop(): void {
    this.unsubscribeAll();
    this.dbStatusCollection.forEach(dbStatus => dbStatus.stop());
    logger.unsubscribeAll();
  }

  private startMongoDbLogging(): void {
    const mongoDbCredentials = this.cloudFoundry.getServicesCredentialsByServiceType(ServiceType.MongoDb);

    mongoDbCredentials.forEach(credential => {
      const mongoDb = new MongoDbMetrics(credential as IMongoDbCredentials, this.options.mongoDB);

      mongoDb.getServerStatus().subscribe(MongoDbMetricsEvent.ServerStatus, serverStatus =>
        this.publish(CfServiceMetricsEvent.Metrics, serverStatus));

      mongoDb.getDbStats().subscribe(MongoDbMetricsEvent.DbStats, dbStats =>
        this.publish(CfServiceMetricsEvent.Metrics, dbStats));

      this.dbStatusCollection.push(mongoDb);
    });
  }

  private startRedisLogging(): void {
    const redisCredentials = this.cloudFoundry.getServicesCredentialsByServiceType(ServiceType.Redis);

    redisCredentials.forEach(credential => {
      const redis = new RedisMetrics(credential as IRedisCredentials, this.options.redis);

      redis.getServerInfo().subscribe(RedisMetricsEvent.ServerInfo, serverInfo =>
        this.publish(CfServiceMetricsEvent.Metrics, serverInfo));

      this.dbStatusCollection.push(redis);
    });
  }
}
