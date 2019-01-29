import { IRedisCredentials } from 'cfenv';
import * as Redis from 'redis';

import {
  IRedisOptions, IServiceMetricsOptions
} from '../../interfaces/service-metrics-options.interface';
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

  private redisClient: Redis.RedisClient;

  constructor(
    credentials: IRedisCredentials,
    options: IRedisOptions
  ) {
    super();
    this.credentials = credentials;
    this.options = options;
  }

  public getServerInfo(): RedisStatus {
    this.connect();

    this.redisClient.on(redisEvents.connect, () => {
      this.setInfoPoller();
      this.pollById(Poller.pollerIds.redis.info);
    });

    return this;
  }

  public stop(): void {
    if (this.redisClient) {
      this.stopAllPollers();
      this.unsubscribeAll();
    }
  }

  private connect(): void {
    const credentials = {
      host: this.credentials.host,
      port: this.credentials.port,
      password: this.credentials.password,
    };

    if (!this.isConnected()) {
      this.redisClient = Redis.createClient(credentials);
    }

    this.redisClient.on(redisEvents.error, error => {
      this.disconnect();
    });
  }

  private disconnect(): void {
    if (this.redisClient) {
      this.redisClient.end(true);
      this.redisClient = undefined;
    }
  }

  private setInfoPoller(): void {
    const infoPoller = new Poller({
      id: Poller.pollerIds.redis.info,
      interval: this.options.infoInterval,
    });
    infoPoller.onPoll(this.onPollInfo.bind(this));
    this.setPoller(infoPoller);
  }

  private onPollInfo(): void {
    this.redisClient.info((error, serverInfo) => {
      if (!error && this.isConnected() && this.getPollerById(Poller.pollerIds.redis.info)) {
        this.publish(RedisStatus.subscriptionIds.serverInfo, serverInfo);
        this.pollById(Poller.pollerIds.redis.info);
      } else {
        this.disconnect();
      }
    });
  }

  private isConnected(): boolean {
    return this.redisClient ? this.redisClient.connected : false;
  }
}
