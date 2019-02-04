import { TCredentials } from 'cfenv';

import { Poller } from '../../helpers/poller';
import { PubSub } from '../../helpers/pub-sub';
import { TDbOptions } from '../../interfaces/service-metrics-options.interface';

export abstract class DatabaseStatus extends PubSub {
  protected abstract credentials: TCredentials;
  protected abstract options: TDbOptions;

  private pollers: Poller[] = [];

  public abstract disconnect(): void;

  public async stop(): Promise<void> {
    this.stopAllPollers();
    this.unsubscribeAll();
    this.disconnect();
  }

  protected startPolling(): void {
    this.pollers.forEach(poller => {
      poller.poll();
    });
  }

  protected setPoller(poller: Poller): void {
    const foundPoller = this.getPollerById(poller.config.id);

    if (!foundPoller) {
      this.pollers.push(poller);
    }
  }

  protected pollById(id: string): void {
    const poller = this.getPollerById(id);

    if (poller) {
      poller.poll();
    }
  }

  protected getPollerById(id: string): Poller | undefined {
    return this.pollers.find(p => p.config.id === id);
  }

  private stopAllPollers(): void {
    this.pollers.forEach(poller => {
      poller.stop();
    });

    this.pollers = [];
  }
}
