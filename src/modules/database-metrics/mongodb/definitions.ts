import { calculatePercentage } from '../../../helpers/converters';
import { IMetricDefinition } from '../interfaces/metric-definition.interface';
import { ReplicationSetMemberState } from './enums/replication-set-member-state.enum';
import {
    getActiveReplicationSetMembersCount
} from './helpers/get-active-replication-set-members-count';
import {
    getInactiveReplicationSetMembersCount
} from './helpers/get-inactive-replication-set-members-count';
import { getReplicationInfoFreeSize } from './helpers/get-replication-info-free-size';
import { getReplicationLag } from './helpers/get-replication-lag';
import { getReplicationSetMembersCount } from './helpers/get-replication-set-members-count';
import {
    getReplicationSetMembersCountByState
} from './helpers/get-replication-set-members-count-by-state';

export const mongoDbDefinitions: IMetricDefinition[] = [
  {
    metric: 'serverStatus.version',
    getValues: ({ serverStatus }) => [{ value: serverStatus.version }],
  },
  {
    metric: 'serverStatus.opcounters.getmore',
    calculateDifferencePerSecond: true,
    getValues: ({ serverStatus }) => [{ value: serverStatus.opcounters.getmore }],
  },
  {
    metric: 'serverStatus.opcounters.query',
    calculateDifferencePerSecond: true,
    getValues: ({ serverStatus }) => [{ value: serverStatus.opcounters.query }],
  },
  {
    metric: 'serverStatus.opcounters.delete',
    calculateDifferencePerSecond: true,
    getValues: ({ serverStatus }) => [{ value: serverStatus.opcounters.delete }],
  },
  {
    metric: 'serverStatus.opcounters.insert',
    calculateDifferencePerSecond: true,
    getValues: ({ serverStatus }) => [{ value: serverStatus.opcounters.insert }],
  },
  {
    metric: 'serverStatus.opcounters.update',
    calculateDifferencePerSecond: true,
    getValues: ({ serverStatus }) => [{ value: serverStatus.opcounters.update }],
  },
  {
    metric: 'serverStatus.globalLock.activeClients.readers',
    getValues: ({ serverStatus }) => [{ value: serverStatus.globalLock.activeClients.readers }],
  },
  {
    metric: 'serverStatus.globalLock.activeClients.writers',
    getValues: ({ serverStatus }) => [{ value: serverStatus.globalLock.activeClients.writers }],
  },
  {
    metric: 'serverStatus.globalLock.currentQueue.readers',
    getValues: ({ serverStatus }) => [{ value: serverStatus.globalLock.currentQueue.readers }],
  },
  {
    metric: 'serverStatus.globalLock.currentQueue.writers',
    getValues: ({ serverStatus }) => [{ value: serverStatus.globalLock.currentQueue.writers }],
  },
  {
    metric: 'serverStatus.connections.current',
    getValues: ({ serverStatus }) => [{ value: serverStatus.connections.current }],
  },
  {
    metric: 'serverStatus.connections.available',
    getValues: ({ serverStatus }) => [{ value: serverStatus.connections.available }],
  },
  {
    metric: 'serverStatus.mem.mapped',
    getValues: ({ serverStatus }) => [{ value: serverStatus.mem.mapped }],
  },
  {
    metric: 'serverStatus.mem.resident',
    getValues: ({ serverStatus }) => [{ value: serverStatus.mem.resident }],
  },
  {
    metric: 'serverStatus.mem.virtual',
    getValues: ({ serverStatus }) => [{ value: serverStatus.mem.virtual }],
  },
  {
    metric: 'serverStatus.extra_info.page_faults',
    calculateDifferencePerSecond: true,
    getValues: ({ serverStatus }) => [{ value: serverStatus.extra_info.page_faults }],
  },
  {
    metric: 'dbStats.dataSize',
    getValues: ({ dbStats }) => [{ value: dbStats.dataSize }],
  },
  {
    metric: 'dbStats.fsUsedSize',
    getValues: ({ dbStats }) => [{ value: dbStats.fsUsedSize }],
  },
  {
    metric: 'dbStats.fsTotalSize',
    getValues: ({ dbStats }) => [{ value: dbStats.fsTotalSize }],
  },
  {
    metric: 'serverStatus.metrics.cursor.open.total',
    getValues: ({ serverStatus }) => [{ value: serverStatus.metrics.cursor.open.total }],
  },
  {
    metric: 'serverStatus.metrics.cursor.timedOut',
    getValues: ({ serverStatus }) => [{ value: serverStatus.metrics.cursor.timedOut }],
  },
  {
    metric: 'serverStatus.asserts.msg',
    calculateDifferencePerSecond: true,
    getValues: ({ serverStatus }) => [{ value: serverStatus.asserts.msg }],
  },
  {
    metric: 'serverStatus.asserts.warning',
    calculateDifferencePerSecond: true,
    getValues: ({ serverStatus }) => [{ value: serverStatus.asserts.warning }],
  },
  {
    metric: 'serverStatus.asserts.regular',
    calculateDifferencePerSecond: true,
    getValues: ({ serverStatus }) => [{ value: serverStatus.asserts.regular }],
  },
  {
    metric: 'serverStatus.asserts.user',
    calculateDifferencePerSecond: true,
    getValues: ({ serverStatus }) => [{ value: serverStatus.asserts.user }],
  },
  {
    metric: 'serverStatus.asserts.rollovers',
    calculateDifferencePerSecond: true,
    getValues: ({ serverStatus }) => [{ value: serverStatus.asserts.rollovers }],
  },
  {
    metric: 'replicationInfo.logSizeMB',
    getValues: ({ replicationInfo }) => [{ value: replicationInfo.logSizeMB }],
  },
  {
    metric: 'replicationInfo.usedMB',
    getValues: ({ replicationInfo }) => [{ value: replicationInfo.usedMB }],
  },
  {
    metric: 'replicationInfo.errmsg',
    getValues: ({ replicationInfo }) => [{ value: replicationInfo.errmsg }],
  },
  {
    metric: 'replicationInfo.oplogMainRowCount',
    getValues: ({ replicationInfo }) => [{ value: replicationInfo.oplogMainRowCount }],
  },
  {
    metric: 'replicationInfo.timeDiff',
    getValues: ({ replicationInfo }) => [{ value: replicationInfo.timeDiff }],
  },
  {
    metric: 'replicationInfo.timeDiffHours',
    getValues: ({ replicationInfo }) => [{ value: replicationInfo.timeDiffHours }],
  },
  {
    metric: 'replicationInfo.tFirst',
    getValues: ({ replicationInfo }) => [{ value: replicationInfo.tFirst }],
  },
  {
    metric: 'replicationInfo.tLast',
    getValues: ({ replicationInfo }) => [{ value: replicationInfo.tLast }],
  },
  {
    metric: 'replicationInfo.now',
    getValues: ({ replicationInfo }) => [{ value: replicationInfo.now }],
  },
  {
    metric: 'custom.freeMemorySize',
    getValues: ({ serverStatus }) => [{ value: serverStatus.mem.virtual - serverStatus.mem.resident }],
  },
  {
    metric: 'custom.usedMemoryPercentage',
    getValues: ({ serverStatus }) => [{ value: calculatePercentage(serverStatus.mem.resident, serverStatus.mem.virtual) }],
  },
  {
    metric: 'custom.freeStorageSize',
    getValues: ({ dbStats }) => [{ value: dbStats.fsTotalSize - dbStats.fsUsedSize }],
  },
  {
    metric: 'custom.usedStoragePercentage',
    getValues: ({ dbStats }) => [{ value: calculatePercentage(dbStats.fsUsedSize, dbStats.fsTotalSize) }],
  },
  {
    metric: 'custom.replicationSetName',
    getValues: ({ replicationSetStatus }) => [{ value: replicationSetStatus && replicationSetStatus.set || '' }],
  },
  {
    metric: 'custom.replicationLag',
    getValues: ({ replicationSetStatus }) => getReplicationLag(replicationSetStatus),
  },
  {
    metric: 'custom.replicationSetMembersCount',
    getValues: ({ replicationSetStatus }) => [{ value: getReplicationSetMembersCount(replicationSetStatus) }],
  },
  {
    metric: 'custom.replicationSetPrimaryMembersCount',
    getValues: ({ replicationSetStatus }) => [{
      value: getReplicationSetMembersCountByState(replicationSetStatus, ReplicationSetMemberState.Primary),
    }],
  },
  {
    metric: 'custom.replicationSetSecondaryMembersCount',
    getValues: ({ replicationSetStatus }) => [{
      value: getReplicationSetMembersCountByState(replicationSetStatus, ReplicationSetMemberState.Secondary),
    }],
  },
  {
    metric: 'custom.replicationSetActiveMembersCount',
    getValues: ({ replicationSetStatus }) => [{
      value: getActiveReplicationSetMembersCount(replicationSetStatus),
    }],
  },
  {
    metric: 'custom.replicationSetInactiveMembersCount',
    getValues: ({ replicationSetStatus }) => [{
      value: getInactiveReplicationSetMembersCount(replicationSetStatus),
    }],
  },
  {
    metric: 'custom.oplogFreeSize',
    getValues: ({ replicationInfo }) => getReplicationInfoFreeSize(replicationInfo),
  },
];
