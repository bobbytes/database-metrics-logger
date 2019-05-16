import { DatabaseType } from '../../../enums';
import { Rest } from '../../../helpers/rest';
import { IMetricsResponse } from '../../../interfaces';
import { ITransportInterface } from '../interfaces/transport-interface';
import { mongoDbDefinition } from './database-definitions/mongodb-definition';
import { redisDefinition } from './database-definitions/redis-definition';
import { IDatabaseDefinition } from './interfaces/database-definition.interface';
import { IDatadogMetric } from './interfaces/datadog-metric';
import { IDatadogOptions } from './interfaces/datadog-options';
import { IEventMap } from './interfaces/event-map.interface';
import { IEventRequest } from './interfaces/event-request.interface';
import { IEventResponse } from './interfaces/event-response.interface';
import { TTimeSeriesPoints } from './types/time-series-points.type';

export class DatadogTransport implements ITransportInterface {
  private rest: Rest;

  constructor(private config: IDatadogOptions) {
    const host = config.host || 'app.datadoghq.com';

    this.rest = new Rest({
      host: `https://${host}/api/v1`,
      query: { api_key: config.apiKey, application_key: config.appKey },
    });
  }

  public getMetrics(from: string): Promise<any> {
    return this.rest.get('/metrics', { from });
  }

  public post(metrics: IMetricsResponse): Promise<any> {
    const promises = [
      this.postMetrics(metrics),
      this.postEvents(metrics),
    ];

    return Promise.all(promises);
  }

  public postMetrics(metrics: IMetricsResponse): Promise<any> {
    const series = this.getMetricsSeries(metrics);
    const metricsBody = JSON.stringify({ series });
    return this.rest.post('/series', metricsBody);
  }

  public postEvents(metrics: IMetricsResponse): Promise<IEventResponse[] | void> {
    const events = this.getEvents(metrics);
    const eventBodies = events.map(event => JSON.stringify(event));
    const promises = eventBodies.map(eventBody => this.rest.post<IEventResponse>('/series', eventBody));

    return promises.length ? Promise.all(promises) : Promise.resolve();
  }

  private getMetricsSeries(metrics: IMetricsResponse): IDatadogMetric[] {
    const databaseDefinition = this.getDatabaseDefinition(metrics.databaseType);
    const metricKeys = Object.keys(databaseDefinition.metricMaps);
    const timeStamp = new Date().getTime() / 1000;

    return metricKeys.map(metricKey => this.mapMetric(metricKey, metrics, timeStamp));
  }

  private getEvents(metrics: IMetricsResponse): IEventRequest[] {
    const databaseDefinition = this.getDatabaseDefinition(metrics.databaseType);

    return databaseDefinition.eventMaps && databaseDefinition.eventMaps.length
      ? databaseDefinition.eventMaps.map(eventMap => this.mapEvent(metrics, eventMap))
      : [];
  }

  private mapMetric(metricKey: string, metrics: IMetricsResponse, timeStamp: number): IDatadogMetric {
    const databaseDefinition = this.getDatabaseDefinition(metrics.databaseType);
    const metricValue = metrics.metrics[databaseDefinition.metricMaps[metricKey]] || 0;
    const points: TTimeSeriesPoints[] = [[timeStamp, metricValue]];

    return {
      metric: metricKey,
      points,
      tags: [
        `database-type:${metrics.databaseType}`,
        `service-name:${metrics.name}`,
        ...this.config.tags || [],
        ...this.mapTags(metrics),
      ],
    };
  }

  private mapEvent(metrics: IMetricsResponse, eventMap: IEventMap): IEventRequest {
    return {
      ...eventMap,
      text: metrics.metrics[eventMap.text] || '',
    };
  }

  private mapTags(metrics: IMetricsResponse): string[] {
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
