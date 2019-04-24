import { DatabaseType } from '../../../enums';
import { Rest } from '../../../helpers/rest';
import { mongoDbDefinition } from './database-definitions/mongodb-definition';
import { redisDefinition } from './database-definitions/redis-definition';
import { IDatabaseDefinition } from './interfaces/database-definition.interface';

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
    const series = this.getMetricsSeries(metrics);
    const metricsBody = JSON.stringify({ series });
    return this.rest.post('/series', metricsBody);
  }

  private getMetricsSeries(metrics: any): IMetric[] {
    const databaseDefinition = this.getDatabaseDefinition(metrics.databaseType);

    const metricKeys = Object.keys(databaseDefinition.metricMaps);
    const timeStamp = new Date().getTime() / 1000;

    return metricKeys.map(metricKey => this.mapMetric(metricKey, metrics, timeStamp));
  }

  private mapMetric(metricKey: string, metrics: any, timeStamp: number): IMetric {
    const databaseDefinition = this.getDatabaseDefinition(metrics.databaseType);
    const metricValue = metrics.metrics[databaseDefinition.metricMaps[metricKey]] || 0;
    const points: TTimeSeriesPoints[] = [[timeStamp, metricValue]];

    return {
      metric: metricKey,
      points,
      tags: [`database-type:${metrics.databaseType}`, `service-name:${metrics.name}`, ...this.mapTags(metrics)],
    };
  }

  private mapTags(metrics: any): string[] {
    const databaseDefinition = this.getDatabaseDefinition(metrics.databaseType);
    const tagKeys = databaseDefinition.tagMaps ? Object.keys(databaseDefinition.tagMaps) : [];

    return tagKeys.map(tagKey => `${tagKey}:${metrics.metrics[databaseDefinition.tagMaps[tagKey]] || ''}`);
  }

  private getDatabaseDefinition(databaseType: DatabaseType): IDatabaseDefinition {
    switch (databaseType) {
      case DatabaseType.Redis:
        return redisDefinition;
      case DatabaseType.Mongodb:
        return mongoDbDefinition;
      default:
        return;
    }
  }
}
