import { ReplicationSetMemberState } from '../enums/replication-set-member-state.enum';
import { IReplicationSetMember } from '../interfaces/replication-set-member.interface';
import { IReplicationSetStatus } from '../interfaces/replication-set-status';

const calculateReplicationLag = (primaryMember: IReplicationSetMember, secondaryMember: IReplicationSetMember): number =>
  primaryMember && secondaryMember
    ? (primaryMember.optimeDate.getTime() - secondaryMember.optimeDate.getTime()) / 1000
    : 0;

export const getReplicationLag = (replicationSetStatus: IReplicationSetStatus): number => {
  const primaryMember = replicationSetStatus.members.find(member => member.state === ReplicationSetMemberState.Primary);

  const replicationLags = replicationSetStatus.members
    .filter(member => member.state === ReplicationSetMemberState.Secondary)
    .map(secondaryMember => calculateReplicationLag(primaryMember, secondaryMember));

  return replicationLags.length ? Math.max.apply(undefined, replicationLags) : 0;
};
