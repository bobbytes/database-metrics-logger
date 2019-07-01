import { IMetricValue } from '../../interfaces/metric-value.interface';
import { ReplicationSetMemberState } from '../enums/replication-set-member-state.enum';
import { IReplicationSetMember } from '../interfaces/replication-set-member.interface';
import { IReplicationSetStatus } from '../interfaces/replication-set-status';

const calculateReplicationLag = (primaryMember: IReplicationSetMember, secondaryMember: IReplicationSetMember): number => primaryMember && secondaryMember
  ? (primaryMember.optimeDate.getTime() - secondaryMember.optimeDate.getTime()) / 1000
  : 0;

const getMetricValues = (replicationSetStatus) => {
  const primaryMember = replicationSetStatus.members.find(member => member.state === ReplicationSetMemberState.Primary);

  return replicationSetStatus.members
    .filter(member => member.state === ReplicationSetMemberState.Secondary)
    .filter(member => !!member._id && !isNaN(member._id))
    .map(secondaryMember => ({
      value: calculateReplicationLag(primaryMember, secondaryMember),
      tags: [`replset-member-id:${secondaryMember._id}, replset-member-name:${secondaryMember.name}`],
    }));
};

export const getReplicationLag = (replicationSetStatus: IReplicationSetStatus): IMetricValue[] => {
  if (!replicationSetStatus || !replicationSetStatus.members) {
    return [];
  }

  return getMetricValues(replicationSetStatus);
};
