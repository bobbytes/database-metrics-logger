import { Rest } from '../../../helpers/rest';
import { IMetricsResponse } from '../../../interfaces';
import { DatadogTransportAbstract } from './datadog-transport-abstract';
import { DefaultHost } from './enums/default-hosts.enum';
import { IDatadogOptions } from './interfaces/datadog-options';
import { ILogAttributesMap } from './interfaces/log-attributes-map.interface';
import { ILogRequest } from './interfaces/log-request.interface';
import { ILog } from './interfaces/log.interface';

export class DatadogLog extends DatadogTransportAbstract {
  private logRest: Rest;

  constructor(config: IDatadogOptions) {
    super(config);

    const host = config.logHost || DefaultHost.LogHost;

    this.logRest = new Rest({
      host: `https://${host}/v1/input/${config.apiKey}`,
    });
  }

  public post(metrics: IMetricsResponse): Promise<any | void> {
    const logs = this.getLogs(metrics);
    const promises = logs.map(log => this.logRest.post('', JSON.stringify(log)));

    return promises.length ? Promise.all(promises) : Promise.resolve();
  }

  private getLogs(metrics: IMetricsResponse): ILogRequest[] {
    const databaseDefinition = this.getDatabaseDefinition(metrics.databaseType);

    return databaseDefinition.logs && databaseDefinition.logs.length
      ? databaseDefinition.logs.map(log => this.mapLog(metrics, log))
      : [];
  }

  private mapLog(metrics: IMetricsResponse, log: ILog): ILogRequest {
    const { attributesMap, service, ddtags, ...logRequest } = log;
    const attributes = this.mapLogAttributes(metrics, attributesMap);

    return {
      ...logRequest,
      ...attributes,
      service: service || metrics.name,
      ddtags: [...(ddtags || []), ...this.getTags(metrics)].join(','),
    };
  }

  private mapLogAttributes(metrics: IMetricsResponse, attributesMap: ILogAttributesMap = {}): {} {
    const attributes = {};
    const attributeKeys = Object.keys(attributesMap);

    attributeKeys.forEach(attributeKey => {
      if (metrics.metrics && metrics.metrics[attributesMap[attributeKey]]) {
        attributes[attributeKey] = metrics.metrics[attributesMap[attributeKey]];
      }
    });

    return attributes;
  }
}
