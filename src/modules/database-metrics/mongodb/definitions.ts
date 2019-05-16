import { calculatePercentage } from '../../../helpers/converters';
import { IMetricDefinition } from '../interfaces/metric-definition.interface';
import { ReplicationSetMemberState } from './enums/replication-set-member-state.enum';
import { getReplicationLag } from './helpers/replication-lag';

export const mongoDbDefinitions: IMetricDefinition[] = [
  {
    metric: 'serverStatus.version',
  },
  {
    metric: 'serverStatus.opcounters.getmore',
    calculateDifferencePerSecond: true,
  },
  {
    metric: 'serverStatus.opcounters.query',
    calculateDifferencePerSecond: true,
  },
  {
    metric: 'serverStatus.opcounters.delete',
    calculateDifferencePerSecond: true,
  },
  {
    metric: 'serverStatus.opcounters.insert',
    calculateDifferencePerSecond: true,
  },
  {
    metric: 'serverStatus.opcounters.update',
    calculateDifferencePerSecond: true,
  },
  {
    metric: 'serverStatus.globalLock.activeClients.readers',
  },
  {
    metric: 'serverStatus.globalLock.activeClients.writers',
  },
  {
    metric: 'serverStatus.globalLock.currentQueue.readers',
  },
  {
    metric: 'serverStatus.globalLock.currentQueue.writers',
  },
  {
    metric: 'serverStatus.connections.current',
  },
  {
    metric: 'serverStatus.connections.available',
  },
  {
    metric: 'serverStatus.mem.mapped',
  },
  {
    metric: 'serverStatus.mem.resident',
  },
  {
    metric: 'serverStatus.mem.virtual',
  },
  {
    metric: 'serverStatus.extra_info.page_faults',
    calculateDifferencePerSecond: true,
  },
  {
    metric: 'dbStats.dataSize',
  },
  {
    metric: 'serverStatus.metrics.cursor.open.total',
  },
  {
    metric: 'serverStatus.metrics.cursor.timedOut',
  },
  {
    metric: 'serverStatus.asserts.msg',
    calculateDifferencePerSecond: true,
  },
  {
    metric: 'serverStatus.asserts.warning',
    calculateDifferencePerSecond: true,
  },
  {
    metric: 'serverStatus.asserts.regular',
    calculateDifferencePerSecond: true,
  },
  {
    metric: 'serverStatus.asserts.user',
    calculateDifferencePerSecond: true,
  },
  {
    metric: 'serverStatus.asserts.rollovers',
    calculateDifferencePerSecond: true,
  },
  {
    metric: 'custom.freeMemorySize',
    calculate: metrics => metrics.serverStatus.mem.virtual - metrics.serverStatus.mem.resident,
  },
  {
    metric: 'custom.usedMemoryPercentage',
    calculate: metrics => calculatePercentage(metrics.serverStatus.mem.resident, metrics.serverStatus.mem.virtual),
  },
  {
    metric: 'custom.freeStorageSize',
    calculate: metrics => metrics.dbStats.fsTotalSize - metrics.dbStats.fsUsedSize,
  },
  {
    metric: 'custom.usedStoragePercentage',
    calculate: metrics => calculatePercentage(metrics.dbStats.fsUsedSize, metrics.dbStats.fsTotalSize),
  },
  {
    metric: 'custom.replicationSetName',
    calculate: metrics => metrics.replicationSetStatus && metrics.replicationSetStatus.set
      ? metrics.replicationSetStatus.set
      : '',
  },
  {
    metric: 'custom.replicationLag',
    calculate: metrics => metrics.replicationSetStatus && metrics.replicationSetStatus.members
      ? getReplicationLag(metrics.replicationSetStatus)
      : 0,
  },
  {
    metric: 'custom.replicationSetMembersCount',
    calculate: metrics => metrics.replicationSetStatus && metrics.replicationSetStatus.members
      ? metrics.replicationSetStatus.members.length
      : 0,
  },
  {
    metric: 'custom.replicationSetPrimaryMembersCount',
    calculate: metrics => metrics.replicationSetStatus && metrics.replicationSetStatus.members
      ? metrics.replicationSetStatus.members.filter(member => member.state === ReplicationSetMemberState.Primary).length
      : 0,
  },
  {
    metric: 'custom.replicationSetSecondaryMembersCount',
    calculate: metrics => metrics.replicationSetStatus && metrics.replicationSetStatus.members
      ? metrics.replicationSetStatus.members.filter(member => member.state === ReplicationSetMemberState.Secondary).length
      : 0,
  },
  {
    metric: 'custom.replicationSetActiveMembersCount',
    calculate: metrics => metrics.replicationSetStatus && metrics.replicationSetStatus.members
      ? metrics.replicationSetStatus.members.filter(member =>
        member.state === ReplicationSetMemberState.Primary || member.state === ReplicationSetMemberState.Secondary).length
      : 0,
  },
  {
    metric: 'custom.replicationSetInactiveMembersCount',
    calculate: metrics => metrics.replicationSetStatus && metrics.replicationSetStatus.members
      ? metrics.replicationSetStatus.members.filter(member =>
        member.state !== ReplicationSetMemberState.Primary && member.state !== ReplicationSetMemberState.Secondary).length
      : 0,
  },
];
