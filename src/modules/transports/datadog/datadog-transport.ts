import { DatabaseType } from '../../../database-metrics-logger';
import { Rest } from '../../../helpers/rest';
import { mongoDbMetricsMap } from './metrics-map/mongodb-metrics-map';
import { redisMetricsMap } from './metrics-map/redis-metrics-map';

export type TTimeSeriesPoints = [number, any];

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
    const metricFieldsMap = this.getMetricMapping(metrics.databaseType);

    const metricKeys = Object.keys(metricFieldsMap);
    const timeStamp = new Date().getTime() / 1000;

    return metricKeys.map(metricKey => {
      const metricValue = metrics.metrics[metricFieldsMap[metricKey]] || 0;
      const points: TTimeSeriesPoints[] = [[timeStamp, metricValue]];

      return {
        metric: metricKey,
        points,
        tags: [`database-type:${metrics.databaseType}`, `service-name:${metrics.name}`],
      };
    });
  }

  private getMetricMapping(databaseType: DatabaseType): {} {
    switch (databaseType) {
      case DatabaseType.Redis:
        return redisMetricsMap;
      case DatabaseType.Mongodb:
        return mongoDbMetricsMap;
      default:
        return {};
    }
  }
}
