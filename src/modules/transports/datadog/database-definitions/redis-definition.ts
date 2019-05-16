import { AlertType, EventPriority } from '../enums';
import { SourceTypeName } from '../enums/source-type-name.enum';
import { IDatabaseDefinition } from '../interfaces/database-definition.interface';

export const redisDefinition: IDatabaseDefinition = {
  metricMaps: {
    // unsaved changes
    'redis.rdb.changes_since_last': 'rdb_changes_since_last_save',

    // master down
    'redis.replication.master_link_down_since_seconds': 'master_link_down_since_seconds',

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

    // version (custom)
    'redis.version': 'redis_version',
  },
  eventMaps: [{
    title: 'Redis Version',
    text: 'redis_version',
    alert_type: AlertType.Info,
    priority: EventPriority.Low,
    source_type_name: SourceTypeName.REDIS,
  }],
  tagMaps: {
    'redis-version': 'redis_version',
  },
};
