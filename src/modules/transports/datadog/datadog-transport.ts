import { IMetricsResponse } from '../../../interfaces';
import { ITransportInterface } from '../interfaces/transport-interface';
import { DatadogEvent } from './datadog-event';
import { DatadogLog } from './datadog-log';
import { DatadogMetric } from './datadog-metric';
import { IDatadogOptions } from './interfaces/datadog-options';

export class DatadogTransport implements ITransportInterface {
  private metric: DatadogMetric;
  private event: DatadogEvent;
  private log: DatadogLog;

  constructor(config: IDatadogOptions) {
    this.metric = new DatadogMetric(config);
    this.event = new DatadogEvent(config);
    this.log = new DatadogLog(config);
  }

  public post(metrics: IMetricsResponse): Promise<any> {
    const promises = [
      this.metric.post(metrics),
      this.event.post(metrics),
      this.log.post(metrics),
    ];

    return Promise.all(promises);
  }
}
