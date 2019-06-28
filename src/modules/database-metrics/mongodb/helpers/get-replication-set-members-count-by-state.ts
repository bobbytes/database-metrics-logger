import { ReplicationSetMemberState } from '../enums/replication-set-member-state.enum';

export const getReplicationSetMembersCountByState = (replicationSetStatus, state: ReplicationSetMemberState) =>
  replicationSetStatus && replicationSetStatus.members
    ? replicationSetStatus.members.filter(member => member.state === state).length
    : 0;
