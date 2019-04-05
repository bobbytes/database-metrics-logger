import { Db, MongoClient } from 'mongodb';

import { IDatabaseCredentials } from '../../database-metrics-logger';
import { toPercentage } from '../../helpers/converters';
import { logger } from '../../helpers/logger';
import { Poller } from '../../helpers/poller';
import { DatabaseMetrics } from './database-metrics';

export class MongodbMetrics extends DatabaseMetrics {
  private mongoClient?: MongoClient;

  constructor(
    private credentials: IDatabaseCredentials
  ) {
    super();
  }

  public getMetrics(): MongodbMetrics {
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
        database.command({ serverStatus: 1 }),
        database.command({ dbStats: 1, scale: 1024 }),
        this.getReplicationSetMetrics(),
      ];

      const [serverStatus, dbStats, replicationSetStatus] = await Promise.all(promises);

      const metrics = this.mapMetrics({ ...serverStatus, dbStats, replicationSetStatus });

      this.publish(undefined, this.credentials, metrics);
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

  private mapMetrics(unmappedMetrics: any): {} {
    const calculatedFields = this.getCalculatedFields(unmappedMetrics);
    const { connections, extra_info, globalLock, opcounters, mem, dbStats, replicationSetStatus, metrics, asserts } = unmappedMetrics;
    return { connections, extra_info, globalLock, opcounters, mem, dbStats, replicationSetStatus, calculatedFields, metrics, asserts };
  }

  private getCalculatedFields(metrics: any): any {
    const freeMemorySize = metrics.mem.virtual - metrics.mem.resident;
    const usedMemoryPercentage = toPercentage(metrics.mem.resident, metrics.mem.virtual);
    const freeStorageSize = metrics.dbStats.fsTotalSize - metrics.dbStats.fsUsedSize;
    const usedStoragePercentage = toPercentage(metrics.dbStats.fsUsedSize, metrics.dbStats.fsTotalSize);

    return { freeMemorySize, usedMemoryPercentage, freeStorageSize, usedStoragePercentage };
  }
}
