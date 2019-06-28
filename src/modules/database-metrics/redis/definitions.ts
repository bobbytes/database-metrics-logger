import { IMetricDefinition } from '../interfaces/metric-definition.interface';

export const redisDefinitions: IMetricDefinition[] = [
  {
    metric: 'redis_version',
    getValues: ({ redis_version }) => [{ value: redis_version }],
  },
  {
    metric: 'rdb_changes_since_last_save',
    getValues: ({ rdb_changes_since_last_save }) => [{ value: rdb_changes_since_last_save }],
  },
  {
    metric: 'master_link_down_since_seconds',
    getValues: ({ master_link_down_since_seconds }) => [{ value: master_link_down_since_seconds || 0 }],
  },
  {
    metric: 'total_commands_processed',
    getValues: ({ total_commands_processed }) => [{ value: total_commands_processed }],
  },
  {
    metric: 'keyspace_hits',
    getValues: ({ keyspace_hits }) => [{ value: keyspace_hits }],
  },
  {
    metric: 'keyspace_misses',
    getValues: ({ keyspace_misses }) => [{ value: keyspace_misses }],
  },
  {
    metric: 'slow_log_percentile',
    getValues: ({ slow_log_percentile }) => [{ value: slow_log_percentile }],
  },
  {
    metric: 'redis_info_latency',
    getValues: ({ redis_info_latency }) => [{ value: redis_info_latency }],
  },
  {
    metric: 'evicted_keys',
    getValues: ({ evicted_keys }) => [{ value: evicted_keys }],
  },
  {
    metric: 'mem_fragmentation_ratio',
    getValues: ({ mem_fragmentation_ratio }) => [{ value: mem_fragmentation_ratio }],
  },
  {
    metric: 'blocked_clients',
    getValues: ({ blocked_clients }) => [{ value: blocked_clients }],
  },
  {
    metric: 'used_memory',
    getValues: ({ used_memory }) => [{ value: used_memory }],
  },
  {
    metric: 'connected_slaves',
    getValues: ({ connected_slaves }) => [{ value: connected_slaves }],
  },
  {
    metric: 'rejected_connections',
    getValues: ({ rejected_connections }) => [{ value: rejected_connections }],
  },
  {
    metric: 'connected_clients',
    getValues: ({ connected_clients }) => [{ value: connected_clients }],
  },
  {
    metric: 'db_size',
    getValues: ({ db_size }) => [{ value: db_size }],
  },
];
