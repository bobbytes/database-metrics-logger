import { Timestamp } from 'bson';

export interface IOperationTime {
  ts: Timestamp;
  t: number;
}
