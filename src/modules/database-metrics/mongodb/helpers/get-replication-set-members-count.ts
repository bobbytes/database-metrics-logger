export const getReplicationSetMembersCount = replicationSetStatus =>
  replicationSetStatus && replicationSetStatus.members && replicationSetStatus.members.length || 0;
