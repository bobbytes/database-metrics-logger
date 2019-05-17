import { IMetricsResponse } from '../../../interfaces';
import { DatadogTransportAbstract } from './datadog-transport-abstract';
import { IDatadogOptions } from './interfaces/datadog-options';
import { IEventMap } from './interfaces/event-map.interface';
import { IEventRequest } from './interfaces/event-request.interface';
import { IEventResponse } from './interfaces/event-response.interface';

export class DatadogEvent extends DatadogTransportAbstract {
  constructor(config: IDatadogOptions) {
    super(config);
  }

  public post(metrics: IMetricsResponse): Promise<IEventResponse[] | void> {
    const events = this.getEvents(metrics);
    const eventBodies = events.map(event => JSON.stringify(event));
    const promises = eventBodies.map(eventBody => this.rest.post<IEventResponse>('/events', eventBody));

    return promises.length ? Promise.all(promises) : Promise.resolve();
  }

  private getEvents(metrics: IMetricsResponse): IEventRequest[] {
    const databaseDefinition = this.getDatabaseDefinition(metrics.databaseType);

    return databaseDefinition.eventMaps && databaseDefinition.eventMaps.length
      ? databaseDefinition.eventMaps.map(eventMap => this.mapEvent(metrics, eventMap))
      : [];
  }

  private mapEvent(metrics: IMetricsResponse, eventMap: IEventMap): IEventRequest {
    return {
      ...eventMap,
      text: metrics.metrics[eventMap.text] || '',
    };
  }
}
