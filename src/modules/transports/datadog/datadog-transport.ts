import { DatabaseType } from '../../../database-metrics-logger';
import { Rest } from '../../../helpers/rest';
import { redisFields } from './metrics-fields/redis-fields';

export type TTimeSeriesPoints = [string, any];

enum MetricTypeEnum {
  Gauge = 'gauge',
  Rate = 'rate',
  Count = 'count',
}

export interface IMetric {
  metric: string;
  points: TTimeSeriesPoints[];
  type?: MetricTypeEnum;
  interval?: number;
  host?: string;
  tags?: string[];
}

interface IDatadogOptions {
  apiKey: string;
  appKey?: string;
  host?: string;
}

export class DatadogTransport {
  private rest: Rest;

  constructor(config: IDatadogOptions) {
    const host = config.host || 'app.datadoghq.com';

    this.rest = new Rest({
      host: `https://${host}/api/v1`,
      query: { api_key: config.apiKey, application_key: config.appKey },
    });
  }

  public getMetrics(from: string): Promise<any> {
    return this.rest.get('/metrics', { from });
  }

  public postMetrics(metrics: {}): Promise<any> {
    const mappedMetrics = this.mapMetrics(metrics);
    const metricsBody = JSON.stringify({ series: mappedMetrics });
    return this.rest.post('/series', metricsBody);
  }

  private mapMetrics(metrics: any): IMetric[] {
    let metricFieldsMap = {};

    switch (metrics.databaseType) {
      case DatabaseType.Redis:
        metricFieldsMap = redisFields;
        break;
      default:
    }

    const metricKeys = Object.keys(metricFieldsMap);
    const milliseconds = `${new Date().getTime()}`;

    return metricKeys.map(metricKey => {
      const points: TTimeSeriesPoints[] = [[milliseconds, metrics[metricFieldsMap[metricKey]]]];

      return {
        metric: metricKey,
        points,
        tags: [`service-name:${metrics.name}`],
      };
    });
  }
}
