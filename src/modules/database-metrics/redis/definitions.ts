import { IMetricDefinition } from '../interfaces/metric-definition.interface';

export const redisDefinitions: IMetricDefinition[] = [
  {
    metric: 'rdb_changes_since_last_save',
  },
  {
    metric: 'master_link_down_since_seconds',
  },
  {
    metric: 'total_commands_processed',
  },
  {
    metric: 'keyspace_hits',
  },
  {
    metric: 'keyspace_misses',
  },
  {
    metric: 'slow_log_percentile',
  },
  {
    metric: 'redisInfoLatency',
  },
  {
    metric: 'evicted_keys',
  },
  {
    metric: 'mem_fragmentation_ratio',
  },
  {
    metric: 'blocked_clients',
  },
  {
    metric: 'used_memory',
  },
  {
    metric: 'connected_slaves',
  },
  {
    metric: 'rejected_connections',
  },
  {
    metric: 'connected_clients',
  },
  {
    metric: 'db_size',
  },
];
