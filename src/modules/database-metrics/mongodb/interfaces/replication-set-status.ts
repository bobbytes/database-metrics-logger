import { Timestamp } from 'bson';

import { IClusterTime } from './cluster-time.interface';
import { IOperationTimes } from './operation-times.interface';
import { IReplicationSetMember } from './replication-set-member.interface';

export interface IReplicationSetStatus {
  $clusterTime: IClusterTime;
  date; Date;
  heartbeatIntervalMillis: number;
  lastStableCheckpointTimestamp: Timestamp;
  members: IReplicationSetMember[];
  myState: number;
  ok: number;
  operationTime: Timestamp;
  optimes: IOperationTimes;
  set: string;
  syncingTo: string;
  syncSourceHost: string;
  syncSourceId: number;
  term: number;
}
