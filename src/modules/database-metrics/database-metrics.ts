import { defaultInterval, Poller } from '../../helpers/poller';
import { PubSub } from '../../helpers/pub-sub';
import { IDatabaseCredentials, IMetricsResponse } from '../../interfaces';
import { IMetricDefinition } from './interfaces/metric-definition.interface';
import { IMetricValue } from './interfaces/metric-value.interface';

export abstract class DatabaseMetrics extends PubSub {
  private pollers: Poller[] = [];
  private lastMetrics = new Map<string, IMetricValue[]>();

  constructor(
    public credentials: IDatabaseCredentials,
    private metricDefinitions: IMetricDefinition[]
  ) {
    super();
  }

  public abstract getMetrics(): any;
  public abstract disconnect(): void;

  public async stop(): Promise<void> {
    this.stopAllPollers();
    this.unsubscribeAll();
    this.disconnect();
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

  protected publishMetrics(metrics: {}): void {
    const valueToPublish: IMetricsResponse = {
      databaseType: this.credentials.databaseType,
      name: this.credentials.name,
      metrics: this.aggregateMetrics(metrics),
    };

    super.publish(undefined, valueToPublish);
  }

  private stopAllPollers(): void {
    this.pollers.forEach(poller => {
      poller.stop();
    });

    this.pollers = [];
  }

  private aggregateMetrics(metrics: {}): {} {
    const aggregatedMetrics = {};

    this.metricDefinitions.forEach(metricDefinition => {
      const metric = metricDefinition.calculateDifferencePerSecond
        ? this.getDifferencePerSecond(metricDefinition, metrics)
        : metricDefinition.getValues(metrics);

      aggregatedMetrics[metricDefinition.metric] = metric;
    });

    return aggregatedMetrics;
  }

  private getDifferencePerSecond(metricDefinition: IMetricDefinition, metrics: {}): any[] {
    const lastMetric = this.lastMetrics.get(metricDefinition.metric) || [];
    const currentMetrics = metricDefinition.getValues(metrics);
    const interval = this.credentials.interval || defaultInterval;

    const metricsDifferencePerSecond = currentMetrics.map((currentMetric, index) => ({
      ...currentMetric,
      value: Math.round((currentMetric.value - (lastMetric[index] && lastMetric[index].value || 0)) / (interval / 1000)),
    }));

    this.lastMetrics.set(metricDefinition.metric, currentMetrics);

    return metricsDifferencePerSecond;
  }
}
