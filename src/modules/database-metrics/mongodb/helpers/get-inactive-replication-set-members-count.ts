import { ReplicationSetMemberState } from '../enums/replication-set-member-state.enum';

export const getInactiveReplicationSetMembersCount = replicationSetStatus =>
  replicationSetStatus && replicationSetStatus.members
    ? replicationSetStatus.members.filter(member =>
      member.state !== ReplicationSetMemberState.Primary && member.state !== ReplicationSetMemberState.Secondary).length
    : 0;
