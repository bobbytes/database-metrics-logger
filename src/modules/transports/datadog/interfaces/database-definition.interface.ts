import { IEventMap } from './event-map.interface';
import { ILog } from './log.interface';
import { IMetricMap } from './metric-map.interface';
import { ITagMap } from './tag-map.interface';

export interface IDatabaseDefinition {
  metricMaps: IMetricMap;
  logs?: ILog[];
  eventMaps?: IEventMap[];
  tagMaps?: ITagMap;
}
