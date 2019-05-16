import { EventPriority } from '../enums/event-priority.enum';

export interface IEventResponseEvent {
  date_happened: number;
  id: number;
  priority: EventPriority;
  text: string;
  title: string;
  url: string;
  handle?: string;
  related_event_id?: number;
  tags?: string[];
}
