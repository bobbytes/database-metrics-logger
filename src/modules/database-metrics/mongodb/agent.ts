import { MongoClient } from 'mongodb';

import { logger } from '../../../helpers/logger';
import { Poller } from '../../../helpers/poller';
import { IDatabaseCredentials } from '../../../interfaces';
import { DatabaseMetrics } from '../database-metrics';
import { mongoDbDefinitions } from './definitions';
import { getReplicationInfo } from './helpers/get-replication-info';

export class MongoDbAgent extends DatabaseMetrics {
  private mongoClient?: MongoClient;

  constructor(
    credentials: IDatabaseCredentials
  ) {
    super(credentials, mongoDbDefinitions);
  }

  public getMetrics(): MongoDbAgent {
    this.connect()
      .then(() => {
        const metricsPoller = new Poller({
          id: Poller.pollerIds.mongodb,
          interval: this.credentials.interval,
        });

        metricsPoller.onPoll(this.onPollMetrics.bind(this));
        this.setPoller(metricsPoller);
        this.pollById(Poller.pollerIds.mongodb);
      })
      .catch(error => logger.error(error));

    return this;
  }

  public disconnect(): void {
    if (this.mongoClient) {
      this.mongoClient.close();
      this.mongoClient = undefined;
    }
  }

  private async connect(): Promise<void> {
    const uri = this.credentials.uri;

    if (!this.isConnected()) {
      try {
        this.mongoClient = await MongoClient.connect(uri, { useNewUrlParser: true });
      } catch (error) {
        this.disconnect();
        return Promise.reject(error);
      }
    }
  }

  private isConnected(): boolean {
    return !!this.mongoClient && !!this.mongoClient.isConnected();
  }

  private async onPollMetrics(): Promise<void> {
    if (this.isConnected()) {
      const database = this.mongoClient.db(this.credentials.database);

      const promises = [
        database.command({ serverStatus: 1, repl: 1, metrics: 1, locks: 1 }),
        database.command({ dbStats: 1 }),
        this.getReplicationSetMetrics(),
        getReplicationInfo(this.mongoClient),
      ];

      const [serverStatus, dbStats, replicationSetStatus, replicationInfo] = await Promise.all(promises);
      const metrics = { serverStatus, dbStats, replicationSetStatus, replicationInfo };

      this.publishMetrics(metrics);
      this.pollById(Poller.pollerIds.mongodb);
    }
  }

  private async getReplicationSetMetrics(): Promise<void> {
    const database = this.mongoClient.db(this.credentials.database);
    const adminDatabase = database.admin();

    try {
      return await adminDatabase.command({ replSetGetStatus: 1 });
    } catch (error) {
      logger.info(error);
    }
  }
}
