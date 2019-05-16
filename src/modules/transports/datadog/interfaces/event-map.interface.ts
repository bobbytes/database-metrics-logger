import { AlertType, EventPriority } from '../enums';
import { SourceTypeName } from '../enums/source-type-name.enum';

export interface IEventMap {
  title: string;
  text: string;
  alert_type?: AlertType;
  priority?: EventPriority;
  date_happened?: number;
  aggregation_key?: string;
  host?: string;
  source_type_name?: SourceTypeName;
  tags?: string[];
}
