import { IMongoDbCredentials } from 'cfenv';
import * as MongoDb from 'mongodb';

import { logger } from '../../helpers/logger';
import { Poller } from '../../helpers/poller';
import { IMongoDbOptions } from '../../interfaces/service-metrics-options.interface';
import { DatabaseStatus } from './database-status';

export enum MongoDbStatusEvent {
  ServerStatus = 'mongoDb:serverStatus',
  DbStats = 'mongoDB:dbStats',
}

export class MongoDbStatus extends DatabaseStatus {
  protected credentials: IMongoDbCredentials;
  protected options: IMongoDbOptions;

  private mongoClientPromise?: Promise<MongoDb.MongoClient | void>;

  constructor(credentials: IMongoDbCredentials, options: IMongoDbOptions) {
    super();
    this.options = options;
    this.credentials = credentials;
  }

  public getServerStatus(): MongoDbStatus {
    const serverStatusPoller = new Poller({
      id: Poller.pollerIds.mongoDb.serverStatus,
      interval: this.options.serverStatusInterval,
    });

    serverStatusPoller.onPoll(this.onPollServerStatus.bind(this));
    this.getMetrics(serverStatusPoller);

    return this;
  }

  public getDbStats(): MongoDbStatus {
    const dbStatsPoller = new Poller({
      id: Poller.pollerIds.mongoDb.dbStats,
      interval: this.options.dbStatsInterval,
    });

    dbStatsPoller.onPoll(this.onPollDbStats.bind(this));
    this.getMetrics(dbStatsPoller);

    return this;
  }

  public async disconnect(): Promise<void> {
    const mongoClient = await this.getMongoClient();

    if (mongoClient) {
      mongoClient.close();
    }

    this.mongoClientPromise = undefined;
  }

  private async getMongoClient(): Promise<MongoDb.MongoClient | void> {
    const uri = this.credentials.database_uri;

    if (!this.mongoClientPromise) {
      this.mongoClientPromise = MongoDb.MongoClient.connect(uri, { useNewUrlParser: true })
        .catch(error => logger.error(error));
    }

    return this.mongoClientPromise;
  }

  private async getDatabase(): Promise<MongoDb.Db | void> {
    const mongoClient = await this.getMongoClient();
    return mongoClient && mongoClient.isConnected() ? mongoClient.db(this.credentials.database) : undefined;
  }

  private getMetrics(poller: Poller): void {
    this.getMongoClient()
      .then(mongoClient => {
        if (mongoClient && mongoClient.isConnected()) {
          this.setPoller(poller);
          this.pollById(Poller.pollerIds.mongoDb.serverStatus);
        }
      });
  }

  private async onPollServerStatus(): Promise<void> {
    const database = await this.getDatabase();

    if (database) {
      const serverStatus = await database.command({ serverStatus: 1 });
      this.publish(MongoDbStatusEvent.ServerStatus, serverStatus);
    }
  }

  private async onPollDbStats(): Promise<void> {
    const database = await this.getDatabase();

    if (database) {
      const dbStats = await database.command({ dbStats: 1, scale: 1024 });
      this.publish(MongoDbStatusEvent.DbStats, dbStats);
    }
  }
}
