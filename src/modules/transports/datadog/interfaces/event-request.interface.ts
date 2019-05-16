import { AlertType } from '../enums/alert-type.enum';
import { EventPriority } from '../enums/event-priority.enum';
import { SourceTypeName } from '../enums/source-type-name.enum';

export interface IEventRequest {
  title: string;
  text: string;
  priority?: EventPriority;
  date_happened?: number;
  aggregation_key?: string;
  source_type_name?: SourceTypeName;
  host?: string;
  tags?: string[];
  alert_type?: AlertType;
}
