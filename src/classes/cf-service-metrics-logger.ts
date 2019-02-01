import { IMongoDbCredentials, IRedisCredentials } from 'cfenv';

import { mergeDeep } from '../helpers/merge-deep';
import { ILogger } from '../interfaces/logger.interface';
import { IServiceMetricsOptions } from '../interfaces/service-metrics-options.interface';
import { CloudFoundry, ServiceType } from './cloud-foundry';
import { MongoDbStatus } from './database-status/mongo-db-status';
import { RedisStatus } from './database-status/redis-status';

const defaultOptions = {
  mongoDB: {
    serverStatusInterval: 10000,
    dbStatsInterval: 10000,
  },
  redis: {
    infoInterval: 10000,
  },
};

export class CfServiceMetricsLogger {
  private logger: ILogger;
  private options: IServiceMetricsOptions;
  private cloudFoundry: CloudFoundry;
  private dbStatusCollection: (MongoDbStatus | RedisStatus)[] = [];

  constructor(
    logger: ILogger,
    options?: IServiceMetricsOptions
  ) {
    this.logger = logger;
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
    this.dbStatusCollection.forEach(dbStatus => dbStatus.stop());
  }

  private startMondoDbLogging(): void {
    const mongoDbCredentials = this.cloudFoundry.getServicesCredentialsByServiceType(ServiceType.MongoDb);

    mongoDbCredentials.forEach(credential => {
      const mongoDb = new MongoDbStatus(credential as IMongoDbCredentials, this.options.mongoDB);

      mongoDb.getServerStatus().subscribe(MongoDbStatus.subscriptionIds.serverStatus, serverStatus => this.logger.info(serverStatus));
      mongoDb.getDbStats().subscribe(MongoDbStatus.subscriptionIds.dbStats, dbStats => this.logger.info(dbStats));

      this.dbStatusCollection.push(mongoDb);
    });
  }

  private startRedisLogging(): void {
    const redisCredentials = this.cloudFoundry.getServicesCredentialsByServiceType(ServiceType.Redis);

    redisCredentials.forEach(credential => {
      const redis = new RedisStatus(credential as IRedisCredentials, this.options.redis);

      redis.getServerInfo().subscribe(RedisStatus.subscriptionIds.serverInfo, info => this.logger.info(info));
      this.dbStatusCollection.push(redis);
    });
  }
}
