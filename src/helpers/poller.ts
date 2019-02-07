import { EventEmitter } from 'events';

interface IPollerConfig {
  id?: string;
  interval?: number;
}

export class Poller extends EventEmitter {
  public static pollerIds = {
    mongodb: {
      serverStatus: 'mongodb:serverStatus',
      dbStats: 'mongodb:dbStats',
    },
    redis: {
      info: 'redis:info',
    },
  };

  private static eventIds = {
    poll: 'poll',
  };

  public config: IPollerConfig;
  private timeout: NodeJS.Timeout;

  constructor(config: IPollerConfig = {}) {
    super();

    this.config = config;
    this.config.interval = this.config.interval || 1000;
  }

  public poll(): void {
    this.timeout = setTimeout(() => this.emit(Poller.eventIds.poll), this.config.interval);
  }

  public onPoll(callBack: () => void): void {
    this.on(Poller.eventIds.poll, callBack);
  }

  public stop(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
