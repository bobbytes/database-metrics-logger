import { IMetricsResponse } from '../../../interfaces';
import { DatadogTransportAbstract } from './datadog-transport-abstract';
import { IDatadogMetric } from './interfaces/datadog-metric';
import { IDatadogOptions } from './interfaces/datadog-options';
import { TTimeSeriesPoints } from './types/time-series-points.type';

export class DatadogMetric extends DatadogTransportAbstract {
  constructor(config: IDatadogOptions) {
    super(config);
  }

  public post(metrics: IMetricsResponse): Promise<any> {
    const series = this.getMetricsSeries(metrics);

    return this.rest.post('/series', JSON.stringify({ series }));
  }

  private getMetricsSeries(metrics: IMetricsResponse): IDatadogMetric[] {
    const databaseDefinition = this.getDatabaseDefinition(metrics.databaseType);
    const metricKeys = Object.keys(databaseDefinition.metricMaps);
    const timeStamp = new Date().getTime() / 1000;

    let metricsSeries = [];

    metricKeys.forEach(metricKey => metricsSeries = [...metricsSeries, ...this.mapMetricValues(metricKey, metrics, timeStamp)]);

    return metricsSeries;
  }

  private mapMetricValues(metricKey: string, metrics: IMetricsResponse, timeStamp: number): IDatadogMetric[] {
    const databaseDefinition = this.getDatabaseDefinition(metrics.databaseType);
    const metricValues = metrics.metrics[databaseDefinition.metricMaps[metricKey]] || [];

    return metricValues.map(metricValue => {
      const points: TTimeSeriesPoints[] = [[timeStamp, metricValue.value]];

      return {
        metric: metricKey,
        points,
        tags: this.getTags(metrics, metricValue),
      };
    });
  }
}
