import { IMetricMap } from './metric-map.interface';
import { ITagMap } from './tag-map.interface';

export interface IDatabaseDefinition {
  metricMaps: IMetricMap;
  tagMaps?: ITagMap;
}
