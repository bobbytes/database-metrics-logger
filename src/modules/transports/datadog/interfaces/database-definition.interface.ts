import { IEventMap } from './event-map.interface';
import { IMetricMap } from './metric-map.interface';
import { ITagMap } from './tag-map.interface';

export interface IDatabaseDefinition {
  metricMaps: IMetricMap;
  eventMaps?: IEventMap[];
  tagMaps?: ITagMap;
}
