import { IMongoDbCredentials } from 'cfenv';
import * as MongoDb from 'mongodb';

import {
  IMongoDbOptions, IServiceMetricsOptions
} from '../../interfaces/service-metrics-options.interface';
import { DatabaseStatus } from './database-status';
import { Poller } from '../../helpers/poller';

export class MongoDbStatus extends DatabaseStatus {
  public static subscriptionIds = {
    serverStatus: 'mongoDb:serverStatus',
    dbStats: 'mongoDB:dbStats',
  };

  protected credentials: IMongoDbCredentials;
  protected options: IMongoDbOptions;

  private mongoClient: MongoDb.MongoClient;
  private db: MongoDb.Db;

  constructor(credentials: IMongoDbCredentials, options: IMongoDbOptions) {
    super();
    this.options = options;
    this.credentials = credentials;
  }

  public getServerStatus(): MongoDbStatus {
    this.setServerStatusPoller();
    this.connect().then(() => this.pollById(Poller.pollerIds.mongoDb.serverStatus));

    return this;
  }

  public getDbStats(): MongoDbStatus {
    this.setDbStatsPoller();
    this.connect().then(() => this.pollById(Poller.pollerIds.mongoDb.dbStats));

    return this;
  }

  public disconnect(): void {
    if (this.mongoClient) {
      this.mongoClient.close();
      this.unsubscribeAll();
    }
  }

  private async connect(): Promise<void> {
    const uri = this.credentials.database_uri;

    if (this.isConnected()) {
      return Promise.resolve();
    }

    try {
      this.mongoClient = await MongoDb.MongoClient.connect(uri, { useNewUrlParser: true });
      this.db = this.mongoClient.db(this.credentials.database);
    } catch (error) {
      this.disconnect();
      // this.logger.error(error);
    }
  }

  private setServerStatusPoller(): void {
    const serverStatusPoller = new Poller({
      id: Poller.pollerIds.mongoDb.serverStatus,
      interval: this.options.serverStatusInterval,
    });
    serverStatusPoller.onPoll(this.onPollServerStatus.bind(this));
    this.setPoller(serverStatusPoller);
  }

  private setDbStatsPoller(): void {
    const dbStatsPoller = new Poller({
      id: Poller.pollerIds.mongoDb.dbStats,
      interval: this.options.dbStatsInterval,
    });
    dbStatsPoller.onPoll(this.onPollDbStats.bind(this));
    this.setPoller(dbStatsPoller);
  }

  private async onPollServerStatus(): Promise<void> {
    try {
      const serverStatus = await this.db.command({ serverStatus: 1 });
      this.publish(MongoDbStatus.subscriptionIds.serverStatus, serverStatus);
    } catch (error) {
      this.disconnect();
      // this.logger.error(error);
    }

    if (this.isConnected) {
      this.pollById(Poller.pollerIds.mongoDb.serverStatus);
    }
  }

  private async onPollDbStats(): Promise<void> {
    try {
      const dbStats = await this.db.command({ dbStats: 1, scale: 1024 });
      this.publish(MongoDbStatus.subscriptionIds.dbStats, dbStats);
    } catch (error) {
      this.disconnect();
      // this.logger.error(error);
    }

    if (this.isConnected) {
      this.pollById(Poller.pollerIds.mongoDb.dbStats);
    }
  }

  private isConnected(): boolean {
    return this.mongoClient ? this.mongoClient.isConnected() : false;
  }
}
