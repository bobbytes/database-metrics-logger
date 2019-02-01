import { IRedisCredentials } from 'cfenv';
import * as Redis from 'redis';

import { IRedisOptions } from '../../interfaces/service-metrics-options.interface';
import { DatabaseStatus } from './database-status';
import { Poller } from '../../helpers/poller';

const redisEvents = {
  connect: 'connect',
  error: 'error',
};

export class RedisStatus extends DatabaseStatus {
  public static subscriptionIds = {
    serverInfo: 'redis:serverInfo',
  };

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

  public getServerInfo(): RedisStatus {
    this.connect().then(() => {
      const infoPoller = new Poller({
        id: Poller.pollerIds.redis.info,
        interval: this.options.infoInterval,
      });

      infoPoller.onPoll(this.onPollInfo.bind(this));
      this.setPoller(infoPoller);
      this.pollById(Poller.pollerIds.redis.info);
    });

    return this;
  }

  public stop(): void {
    this.stopAllPollers();
    this.unsubscribeAll();
    this.disconnect();
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
          this.redisClient.off(redisEvents.connect, onConnect.bind(this));
          resolve();
        };

        const onError = (): void => {
          this.redisClient.off(redisEvents.error, onError.bind(this));
          this.redisClient.end(true);
          this.redisClient = undefined;
          reject();
        };

        this.redisClient.on(redisEvents.connect, onConnect.bind(this));
        this.redisClient.on(redisEvents.error, onError.bind(this));
      });
    }
  }

  private disconnect(): void {
    if (this.isConnected()) {
      this.redisClient.end(true);
      this.redisClient = undefined;
    }
  }

  private onPollInfo(): void {
    if (this.isConnected()) {
      this.redisClient.info((error, serverInfo) => {
        if (!error) {
          this.publish(RedisStatus.subscriptionIds.serverInfo, serverInfo);
          this.pollById(Poller.pollerIds.redis.info);
        }
      });
    }
  }

  private isConnected(): boolean {
    return !!this.redisClient && !!this.redisClient.connected;
  }
}
