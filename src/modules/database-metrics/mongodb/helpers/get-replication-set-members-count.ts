import { ReplicationSetMemberState } from '../enums/replication-set-member-state.enum';

export const getReplicationSetMembersCount = replicationSetStatus =>
  replicationSetStatus && replicationSetStatus.members && replicationSetStatus.members.length || 0;
