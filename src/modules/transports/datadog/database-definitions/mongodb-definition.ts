import { IDatabaseDefinition } from '../interfaces/database-definition.interface';

export const mongoDbDefinition: IDatabaseDefinition = {
  metricMaps: {
    // read requests per second
    'mongodb.opcounters.getmoreps': 'serverStatus.opcounters.getmore',
    'mongodb.opcounters.queryps': 'serverStatus.opcounters.query',

    // write requests per second
    'mongodb.opcounters.deleteps': 'serverStatus.opcounters.delete',
    'mongodb.opcounters.insertps': 'serverStatus.opcounters.insert',
    'mongodb.opcounters.updateps': 'serverStatus.opcounters.update',

    // number of clients with reads in progress or queued
    'mongodb.globallock.activeclients.readers': 'serverStatus.globalLock.activeClients.readers',

    // number of clients with writes in progress or queued
    'mongodb.globallock.activeclients.writers': 'serverStatus.globalLock.activeClients.writers',

    // queued read and write requests per second
    'mongodb.globallock.currentqueue.readers': 'serverStatus.globalLock.currentQueue.readers',
    'mongodb.globallock.currentqueue.writers': 'serverStatus.globalLock.currentQueue.writers',

    // percentage of client connections used (%)
    'mongodb.connections.current': 'serverStatus.connections.current',
    'mongodb.connections.available': 'serverStatus.connections.available',

    // max memory usage
    'mongodb.mem.mapped': 'serverStatus.mem.mapped',
    'mongodb.mem.resident': 'serverStatus.mem.resident',
    'mongodb.mem.virtual': 'serverStatus.mem.virtual',
    'mongodb.mem.usedpercentage': 'custom.usedMemoryPercentage',
    'mongodb.mem.free': 'custom.freeMemorySize',

    // number of page faults per host
    'mongodb.extra_info.page_faultsps': 'serverStatus.extra_info.page_faults',

    // data size per replica set
    'mongodb.stats.datasize': 'dbStats.dataSize',

    // oplog window per replica set
    // 'mongodb.oplog.timediffseconds': '', // TODO: check

    // max Replication Lag per replica set
    'mongodb.replset.replicationlag': 'custom.replicationLag',

    // number of open cursors per replica set
    'mongodb.cursors.totalopen': 'serverStatus.metrics.cursor.open.total',

    // average duration of background flushes per replica set
    'mongodb.backgroundflushing.average_ms': '',

    // number of timed out cursors per replica set
    'mongodb.cursors.timedout': 'serverStatus.metrics.cursor.timedOut',

    // number of asserts per second
    'mongodb.asserts.msgps': 'serverStatus.asserts.msg',
    'mongodb.asserts.warningps': 'serverStatus.asserts.warning',
    'mongodb.asserts.regularps': 'serverStatus.asserts.regular',
    'mongodb.asserts.userps': 'serverStatus.asserts.user',
    'mongodb.asserts.rolloversps': 'serverStatus.asserts.rollovers',

    // storage (custom)
    'mongodb.storage.fsusedsize': 'dbStats.fsUsedSize',
    'mongodb.storage.fsTotalSize': 'dbStats.fsTotalSize',
    'mongodb.storage.free': 'custom.freeStorageSize',
    'mongodb.storage.usedpercentage': 'custom.usedStoragePercentage',

    // replica set (custom)
    'mongodb.replset.memberscount': 'custom.replicationSetMembersCount',
    'mongodb.replset.primarymemberscount': 'custom.replicationSetPrimaryMembersCount',
    'mongodb.replset.secondarymemberscount': 'custom.replicationSetSecondaryMembersCount',
    'mongodb.replset.activememberscount': 'custom.replicationSetActiveMembersCount',
    'mongodb.replset.inactivememberscount': 'custom.replicationSetInactiveMembersCount',

    // version (custom)
    'mongodb.version': 'serverStatus.version',
  },
  tagMaps: {
    'replset_name': 'custom.replicationSetName',
    'mongodb-version': 'serverStatus.version',
  },
};
