import { IRedisCredentials } from 'cfenv';
import * as Redis from 'redis';

import { logger } from '../../helpers/logger';
import { Poller } from '../../helpers/poller';
import { IRedisOptions } from '../../interfaces/service-metrics-options.interface';
import { DatabaseMetrics } from './database-metrics';

enum RedisEvent {
  Connect = 'connect',
  Error = 'error',
}

export enum RedisMetricsEvent {
  ServerInfo = 'redis:serverInfo',
}

export class RedisMetrics extends DatabaseMetrics {
  protected credentials: IRedisCredentials;
  protected options: IRedisOptions;

  private redisClient?: Redis.RedisClient;

  constructor(
    credentials: IRedisCredentials,
    options: IRedisOptions
  ) {
    super();
    this.credentials = credentials;
    this.options = options;
  }

  public getServerInfo(): RedisMetrics {
    this.connect()
      .then(() => {
        const infoPoller = new Poller({
          id: Poller.pollerIds.redis.info,
          interval: this.options.infoInterval,
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

  private onPollInfo(): void {
    if (this.isConnected()) {
      this.redisClient.info((error, serverInfo) => {
        if (!error) {
          this.publish(RedisMetricsEvent.ServerInfo, serverInfo);
          this.pollById(Poller.pollerIds.redis.info);
        }
      });
    }
  }

  private isConnected(): boolean {
    return !!this.redisClient && !!this.redisClient.connected;
  }
}
