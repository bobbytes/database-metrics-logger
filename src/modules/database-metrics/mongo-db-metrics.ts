import * as MongoDb from 'mongodb';

import { IDatabaseCredentials } from '../../database-metrics-logger';
import { logger } from '../../helpers/logger';
import { Poller } from '../../helpers/poller';
import { DatabaseMetrics } from './database-metrics';

export class MongoDbMetrics extends DatabaseMetrics {
  private mongoClientPromise?: Promise<MongoDb.MongoClient | void>;

  constructor(
    private credentials: IDatabaseCredentials
  ) {
    super();
  }

  public getMetrics(): MongoDbMetrics {
    this.getServerStatus();
    this.getDbStats();

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
    const uri = this.credentials.uri;

    if (!this.mongoClientPromise) {
      this.mongoClientPromise = MongoDb.MongoClient.connect(uri, { useNewUrlParser: true })
        .catch(error => logger.error(error));
    }

    return this.mongoClientPromise;
  }

  private getServerStatus(): void {
    const serverStatusPoller = new Poller({
      id: Poller.pollerIds.mongoDb.serverStatus,
      interval: this.credentials.interval,
    });

    serverStatusPoller.onPoll(this.onPollServerStatus.bind(this));
    this.pollMetrics(serverStatusPoller);
  }

  private getDbStats(): void {
    const dbStatsPoller = new Poller({
      id: Poller.pollerIds.mongoDb.dbStats,
      interval: this.credentials.interval,
    });

    dbStatsPoller.onPoll(this.onPollDbStats.bind(this));
    this.pollMetrics(dbStatsPoller);
  }

  private async getDatabase(): Promise<MongoDb.Db | void> {
    const mongoClient = await this.getMongoClient();
    return mongoClient && mongoClient.isConnected() ? mongoClient.db(this.credentials.database) : undefined;
  }

  private async onPollServerStatus(): Promise<void> {
    const database = await this.getDatabase();

    if (database) {
      const serverStatus = await database.command({ serverStatus: 1 });
      this.publish(undefined, serverStatus);
    }
  }

  private async onPollDbStats(): Promise<void> {
    const database = await this.getDatabase();

    if (database) {
      const dbStats = await database.command({ dbStats: 1, scale: 1024 });
      this.publish(undefined, dbStats);
    }
  }

  private pollMetrics(poller: Poller): void {
    this.getMongoClient()
      .then(mongoClient => {
        if (mongoClient && mongoClient.isConnected()) {
          this.setPoller(poller);
          this.pollById(Poller.pollerIds.mongoDb.serverStatus);
        }
      });
  }
}
