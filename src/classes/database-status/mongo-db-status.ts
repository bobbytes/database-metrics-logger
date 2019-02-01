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

  private mongoClientPromise?: Promise<MongoDb.MongoClient>;

  constructor(credentials: IMongoDbCredentials, options: IMongoDbOptions) {
    super();
    this.options = options;
    this.credentials = credentials;
  }

  public getServerStatus(): MongoDbStatus {
    this.connect().then(() => {
      const serverStatusPoller = new Poller({
        id: Poller.pollerIds.mongoDb.serverStatus,
        interval: this.options.serverStatusInterval,
      });

      serverStatusPoller.onPoll(this.onPollServerStatus.bind(this));
      this.setPoller(serverStatusPoller);
      this.pollById(Poller.pollerIds.mongoDb.serverStatus);
    });

    return this;
  }

  public getDbStats(): MongoDbStatus {
    this.connect().then(() => {
      const dbStatsPoller = new Poller({
        id: Poller.pollerIds.mongoDb.dbStats,
        interval: this.options.dbStatsInterval,
      });
      dbStatsPoller.onPoll(this.onPollDbStats.bind(this));
      this.setPoller(dbStatsPoller);

      this.pollById(Poller.pollerIds.mongoDb.dbStats);
    });

    return this;
  }

  public async stop(): Promise<void> {
    this.stopAllPollers();
    this.unsubscribeAll();
    this.disconnect();
  }

  private connect(): Promise<MongoDb.MongoClient> {
    const uri = this.credentials.database_uri;

    if (!this.mongoClientPromise) {
      this.mongoClientPromise = MongoDb.MongoClient.connect(uri, { useNewUrlParser: true });
    }

    return this.mongoClientPromise;
  }

  private async disconnect(): Promise<void> {
    if (this.isConnected()) {
      const mongoClient = await this.mongoClientPromise;
      mongoClient.close();
      this.mongoClientPromise = undefined;
    }
  }

  private async isConnected(): Promise<boolean> {
    const mongoClient = await this.mongoClientPromise;
    return mongoClient ? mongoClient.isConnected() : false;
  }

  private async getDatabase(): Promise<MongoDb.Db> {
    try {
      const mongoClient = await this.mongoClientPromise;
      return mongoClient.db(this.credentials.database);
    } catch (error) {
      logger.error(error);
    }
  }

  private async onPollServerStatus(): Promise<void> {
    const isConnected = await this.isConnected();

    try {
      if (isConnected) {
        const database = await this.getDatabase();
        const serverStatus = await database.command({ serverStatus: 1 });
        this.publish(MongoDbStatusEvent.ServerStatus, serverStatus);
      }
    } catch (error) {
      logger.error(error);
    }
  }

  private async onPollDbStats(): Promise<void> {
    const isConnected = await this.isConnected();

    try {
      if (isConnected) {
        const database = await this.getDatabase();
        const dbStats = await database.command({ dbStats: 1, scale: 1024 });
        this.publish(MongoDbStatusEvent.DbStats, dbStats);
      }
    } catch (error) {
      logger.error(error);
    }
  }
}
