import { Timestamp } from 'bson';

import { ReplicationSetMemberStateString } from '../enums/replication-set-member-state-string.enum';
import { ReplicationSetMemberState } from '../enums/replication-set-member-state.enum';
import { IOperationTime } from './operation-time.interface';

export interface IReplicationSetMember {
  _id: number;
  configVersion: number;
  electionDate: Date;
  electionTime: Timestamp;
  health: number;
  infoMessage: string;
  lastHeartbeatMessage: string;
  name: string;
  optime: IOperationTime;
  optimeDate: Date;
  self: boolean;
  state: ReplicationSetMemberState;
  stateStr: ReplicationSetMemberStateString;
  syncingTo: string;
  syncSourceHost: string;
  syncSourceId: number;
  uptime: number;
}
