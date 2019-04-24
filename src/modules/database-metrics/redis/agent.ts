import { performance } from 'perf_hooks';
import * as Redis from 'redis';

import { IDatabaseCredentials } from '../../../database-metrics-logger';
import { convertStringToNumber } from '../../../helpers/converters';
import { logger } from '../../../helpers/logger';
import { calculatePercentile } from '../../../helpers/percentile';
import { Poller } from '../../../helpers/poller';
import { DatabaseMetrics } from '../database-metrics';
import { redisDefinitions } from './definitions';

enum RedisEvent {
  Connect = 'connect',
  Error = 'error',
}

export class RedisAgent extends DatabaseMetrics {
  private redisClient?: Redis.RedisClient;

  constructor(
    credentials: IDatabaseCredentials
  ) {
    super(credentials, redisDefinitions);
  }

  public getMetrics(): RedisAgent {
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
        this.getSlowLogPercentile(95),
      ];

      const [redisInfo, dbSize, slowLogPercentile] = await Promise.all(promises);

      this.publishMetrics({ ...redisInfo, db_size: dbSize, slow_log_percentile: slowLogPercentile });
      this.pollById(Poller.pollerIds.redis);
    }
  }

  private getRedisInfo(): Promise<{}> {
    return new Promise((resolve, reject) => {
      const startGetRedisInfoTimestamp = performance.now();
      this.redisClient.info((error, serverInfo) => {
        if (!error) {
          const receiveRedisInfoTimeStamp = performance.now();
          const redisInfoLatency = receiveRedisInfoTimeStamp - startGetRedisInfoTimestamp;
          const parsedServerInfo = this.parseServerInfo(serverInfo as unknown as string);
          resolve({ ...parsedServerInfo, redis_info_latency: redisInfoLatency });
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

  private getSlowLogPercentile(percentile: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redisClient.slowlog('get', (error, response) => {
        if (!error) {
          const milliseconds = response.map(value => value[2]);
          resolve(calculatePercentile(percentile, milliseconds));
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
