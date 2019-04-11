import * as Redis from 'redis';

import { IDatabaseCredentials } from '../../database-metrics-logger';
import { convertStringToNumber } from '../../helpers/converters';
import { logger } from '../../helpers/logger';
import { Poller } from '../../helpers/poller';
import { DatabaseMetrics } from './database-metrics';

enum RedisEvent {
  Connect = 'connect',
  Error = 'error',
}

export class RedisMetrics extends DatabaseMetrics {
  private redisClient?: Redis.RedisClient;

  constructor(
    private credentials: IDatabaseCredentials
  ) {
    super();
  }

  public getMetrics(): RedisMetrics {
    this.connect()
      .then(() => {
        const metricsPoller = new Poller({
          id: Poller.pollerIds.redis,
          interval: this.credentials.interval,
        });

        metricsPoller.onPoll(this.onPollMetrics.bind(this));
        this.setPoller(metricsPoller);
        this.pollById(Poller.pollerIds.redis);
      })
      .catch(error => logger.error(error));

    return this;
  }

  public disconnect(): void {
    if (this.redisClient) {
      this.redisClient.end(true);
      this.redisClient = undefined;
    }
  }

  private connect(): Promise<void> {
    const credentials = {
      host: this.credentials.host,
      port: this.credentials.port,
      password: this.credentials.password,
      url: this.credentials.uri,
    };

    if (!this.isConnected()) {
      return new Promise((resolve, reject) => {
        this.redisClient = Redis.createClient(credentials);

        const onConnect = (): void => {
          this.redisClient.off(RedisEvent.Connect, onConnect.bind(this));
          resolve();
        };

        const onError = (error): void => {
          this.redisClient.off(RedisEvent.Error, onError.bind(this));
          this.disconnect();
          reject(error);
        };

        this.redisClient.on(RedisEvent.Connect, onConnect.bind(this));
        this.redisClient.on(RedisEvent.Error, onError.bind(this));
      });
    }
  }

  private isConnected(): boolean {
    return !!this.redisClient && !!this.redisClient.connected;
  }

  private async onPollMetrics(): Promise<void> {
    if (this.isConnected()) {
      const promises = [
        this.getRedisInfo(),
        this.getDbSize(),
      ];

      const [redisInfo, dbSize] = await Promise.all(promises);

      this.publish(undefined, this.credentials, { ...redisInfo, db_size: dbSize });
      this.pollById(Poller.pollerIds.redis);
    }
  }

  private getRedisInfo(): Promise<{}> {
    return new Promise((resolve, reject) => {
      this.redisClient.info((error, serverInfo) => {
        if (!error) {
          resolve(this.parseServerInfo(serverInfo as unknown as string));
        } else {
          reject(error);
        }
      });
    });
  }

  private getDbSize(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redisClient.dbsize((error, dbSize) => {
        if (!error) {
          resolve(dbSize);
        } else {
          reject(error);
        }
      });
    });
  }

  private parseServerInfo(serverInfo: string): {} {
    const parsedServerInfo = {};
    const serverInfoLines = serverInfo.split('\r\n');

    serverInfoLines.forEach(line => {
      if (line && line.split) {
        const keyValue = line.split(':');

        if (keyValue.length > 1) {
          const key = keyValue.shift();
          parsedServerInfo[key] = convertStringToNumber(keyValue.join(':'));
        }
      }
    });

    return parsedServerInfo;
  }
}
