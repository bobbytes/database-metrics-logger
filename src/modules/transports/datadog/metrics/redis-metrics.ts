export const redisMetrics = {
  // unsaved changes
  'redis.rdb.changes_since_last': 'rdb_changes_since_last_save',

  // master down

  // commands per second
  'redis.net.commands': 'total_commands_processed',

  // cache hit rate
  'redis.stats.keyspace_hits': 'keyspace_hits',
  'redis.stats.keyspace_misses': 'keyspace_misses',

  // slowlog
  'redis.slowlog.micros.95percentile': 'slow_log_percentile',

  // latency
  'redis.info.latency_ms': 'redisInfoLatency',

  // evictions
  'redis.keys.evicted': 'evicted_keys',

  // fragmentation ration
  'redis.mem.fragmentation_ratio': 'mem_fragmentation_ratio',

  // blocked clients
  'redis.clients.blocked': 'blocked_clients',

  // used memory
  'redis.mem.used': 'used_memory',

  // connected slaves
  'redis.net.slaves': 'connected_slaves',

  // rejected connections
  'redis.net.rejected': 'rejected_connections',

  // connected clients
  'redis.net.clients': 'connected_clients',

  // keys
  'redis.keys': 'db_size',
};
