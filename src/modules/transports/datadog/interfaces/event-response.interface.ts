import { ResponseStatus } from '../enums';
import { IEventResponseEvent } from './event-response-event.interface';

export interface IEventResponse {
  event: IEventResponseEvent;
  status: ResponseStatus;
}
