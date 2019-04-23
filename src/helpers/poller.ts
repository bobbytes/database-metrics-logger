import { EventEmitter } from 'events';

interface IPollerConfig {
  id?: string;
  interval?: number;
}

export const defaultInterval = 1000;

export class Poller extends EventEmitter {
  public static pollerIds = {
    mongodb: 'mongodb',
    redis: 'redis',
  };

  private static eventIds = {
    poll: 'poll',
  };

  public config: IPollerConfig;
  private timeout: NodeJS.Timeout;

  constructor(config: IPollerConfig = {}) {
    super();

    this.config = config;
    this.config.interval = this.config.interval || defaultInterval;
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
