import { DatabaseType } from '../../../enums';
import { Rest } from '../../../helpers/rest';
import { IMetricsResponse } from '../../../interfaces';
import { mongoDbDefinition } from './database-definitions/mongodb-definition';
import { redisDefinition } from './database-definitions/redis-definition';
import { DefaultHost } from './enums/default-hosts.enum';
import { IDatabaseDefinition } from './interfaces/database-definition.interface';
import { IDatadogOptions } from './interfaces/datadog-options';

export abstract class DatadogTransportAbstract {
  public rest: Rest;

  constructor(private config: IDatadogOptions) {
    const host = config.host || DefaultHost.Host;

    this.rest = new Rest({
      host: `https://${host}/api/v1`,
      query: { api_key: config.apiKey, application_key: config.appKey },
    });
  }

  public getDatabaseDefinition(databaseType: DatabaseType): IDatabaseDefinition {
    switch (databaseType) {
      case DatabaseType.Redis:
        return redisDefinition;
      case DatabaseType.Mongodb:
        return mongoDbDefinition;
      default:
        return;
    }
  }

  public getTags(metrics: IMetricsResponse): string[] {
    return [
      ...this.mapTags(metrics),
      `database-type:${metrics.databaseType}`,
      `service-name:${metrics.name}`,
      ...this.config.tags || [],
    ];
  }

  private mapTags(metrics: IMetricsResponse): string[] {
    const databaseDefinition = this.getDatabaseDefinition(metrics.databaseType);
    const tagKeys = databaseDefinition.tagMaps ? Object.keys(databaseDefinition.tagMaps) : [];

    return tagKeys.map(tagKey => `${tagKey}:${metrics.metrics[databaseDefinition.tagMaps[tagKey]] || ''}`);
  }
}
