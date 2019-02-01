import { IMongoDbCredentials, IRedisCredentials } from 'cfenv';

import { mergeDeep } from '../helpers/merge-deep';
import { PubSub } from '../helpers/pub-sub';
import { IServiceMetricsOptions } from '../interfaces/service-metrics-options.interface';
import { CloudFoundry, ServiceType } from './cloud-foundry';
import { MongoDbStatus, MongoDbStatusEvent } from './database-status/mongo-db-status';
import { RedisStatus, RedisStatusEvent } from './database-status/redis-status';

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
  Log = 'log',
}

export class CfServiceMetricsLogger extends PubSub {
  private options: IServiceMetricsOptions;
  private cloudFoundry: CloudFoundry;
  private dbStatusCollection: (MongoDbStatus | RedisStatus)[] = [];

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
    this.startMondoDbLogging();
    this.startRedisLogging();
  }

  public stop(): void {
    this.unsubscribeAll();
    this.dbStatusCollection.forEach(dbStatus => dbStatus.stop());
  }

  private startMondoDbLogging(): void {
    const mongoDbCredentials = this.cloudFoundry.getServicesCredentialsByServiceType(ServiceType.MongoDb);

    mongoDbCredentials.forEach(credential => {
      const mongoDb = new MongoDbStatus(credential as IMongoDbCredentials, this.options.mongoDB);

      mongoDb.getServerStatus().subscribe(MongoDbStatusEvent.ServerStatus, serverStatus =>
        this.publish(CfServiceMetricsEvent.Metrics, serverStatus));

      mongoDb.getDbStats().subscribe(MongoDbStatusEvent.DbStats, dbStats =>
        this.publish(CfServiceMetricsEvent.Metrics, dbStats));

      this.dbStatusCollection.push(mongoDb);
    });
  }

  private startRedisLogging(): void {
    const redisCredentials = this.cloudFoundry.getServicesCredentialsByServiceType(ServiceType.Redis);

    redisCredentials.forEach(credential => {
      const redis = new RedisStatus(credential as IRedisCredentials, this.options.redis);

      redis.getServerInfo().subscribe(RedisStatusEvent.ServerInfo, serverInfo =>
        this.publish(CfServiceMetricsEvent.Metrics, serverInfo));

      this.dbStatusCollection.push(redis);
    });
  }
}
