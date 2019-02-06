import * as Redis from 'redis';

import { IDatabaseCredentials } from '../../database-metrics-logger';
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
        const infoPoller = new Poller({
          id: Poller.pollerIds.redis.info,
          interval: this.credentials.interval,
        });

        infoPoller.onPoll(this.onPollInfo.bind(this));
        this.setPoller(infoPoller);
        this.pollById(Poller.pollerIds.redis.info);
      })
      .catch(error => logger.error(error));

    return this;
  }

  public disconnect(): void {
    if (this.isConnected()) {
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
          this.redisClient.end(true);
          this.redisClient = undefined;
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

  private onPollInfo(): void {
    if (this.isConnected()) {
      this.redisClient.info((error, serverInfo) => {
        if (!error) {
          this.publish(undefined, serverInfo);
          this.pollById(Poller.pollerIds.redis.info);
        }
      });
    }
  }
}
