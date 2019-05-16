import { Status } from '../enums/status.enum';
import { IEventResponseEvent } from './event-response-event.interface';

export interface IEventResponse {
  event: IEventResponseEvent;
  status: Status;
}
