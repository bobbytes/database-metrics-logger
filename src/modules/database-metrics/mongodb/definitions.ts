import { toPercentage } from '../../../helpers/converters';
import { IMetricDefinition } from '../interfaces/metric-definition.interface';

export const mongoDbDefinitions: IMetricDefinition[] = [
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
    metric: 'opcounters.update',
    calculateDifferencePerSecond: true,
  },
  {
    metric: 'globalLock.activeClients.readers',
  },
  {
    metric: 'globalLock.activeClients.writers',
  },
  {
    metric: 'globalLock.currentQueue.readers',
  },
  {
    metric: 'globalLock.currentQueue.writers',
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
  },
  {
    metric: 'serverStatus.metrics.dbStats.dataSize',
  },
  {
    metric: 'serverStatus.metrics.cursor.open.total',
  },
  {
    metric: 'serverStatus.metrics.cursors.timedOut',
  },
  {
    metric: 'serverStatus.asserts.msg',
  },
  {
    metric: 'serverStatus.asserts.warning',
  },
  {
    metric: 'serverStatus.asserts.regular',
  },
  {
    metric: 'serverStatus.asserts.user',
  },
  {
    metric: 'serverStatus.asserts.rollovers',
  },
  {
    metric: 'custom.freeMemorySize',
    calculate: metrics => metrics.serverStatus.metrics.mem.virtual - metrics.serverStatus.metrics.mem.resident,
  },
  {
    metric: 'custom.usedMemoryPercentage',
    calculate: metrics => toPercentage(metrics.serverStatus.metrics.mem.resident, metrics.serverStatus.metrics.mem.virtual),
  },
  {
    metric: 'custom.freeStorageSize',
    calculate: metrics => metrics.serverStatus.metrics.dbStats.fsTotalSize - metrics.serverStatus.metrics.dbStats.fsUsedSize,
  },
  {
    metric: 'custom.usedStoragePercentage',
    calculate: metrics => toPercentage(metrics.serverStatus.metrics.dbStats.fsUsedSize, metrics.serverStatus.metrics.dbStats.fsTotalSize),
  },
];
