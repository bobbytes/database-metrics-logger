export const mongoDbMetricsMap = {
  // read requests per second
  'mongodb.opcounters.getmoreps': 'opcounters.getmore',
  'mongodb.opcounters.queryps': 'opcounters.query',

  // write requests per second
  'mongodb.opcounters.deleteps': 'opcounters.delete',
  'mongodb.opcounters.insertps': 'opcounters.insert',
  'mongodb.opcounters.updateps': 'opcounters.update',

  // number of clients with reads in progress or queued
  'mongodb.globallock.activeclients.readers': 'globalLock.activeClients.readers',

  // number of clients with writes in progress or queued
  'mongodb.globallock.activeclients.writers': 'globalLock.activeClients.writers',

  // queued read and write requests per second
  'mongodb.globallock.currentqueue.readers': 'globalLock.currentQueue.readers',
  'mongodb.globallock.currentqueue.writers': 'globalLock.currentQueue.writers',

  // percentage of client connections used (%)
  'mongodb.connections.current': 'connections.current',
  'mongodb.connections.available': 'connections.available',

  // max memory usage
  'mongodb.mem.mapped': 'mem.mapped',
  'mongodb.mem.resident': 'mem.resident',
  'mongodb.mem.virtual': 'mem.virtual',

  // number of page faults per host
  'mongodb.extra_info.page_faultsps': 'extra_info.page_faults',

  // data size per replica set
  'mongodb.stats.datasize': 'metrics.dbStats.dataSize',

  // oplog window per replica set
  'mongodb.oplog.timediffseconds': '', // ?

  // max Replication Lag per replica set
  // 'mongodb.replset.replicationlag': '', // ? needs to be calculated

  // number of open cursors per replica set
  'mongodb.metrics.cursor.open.total': 'metrics.cursor.open.total',

  // number of timed out cursors per replica set
  'mongodb.cursors.timedout': 'metrics.cursors.timedOut',

  // number of asserts per second
  'mongodb.asserts.msgps': 'asserts,msg',
  'mongodb.asserts.warningps': 'asserts.warning',
  'mongodb.asserts.regularps': 'asserts.regular',
  'mongodb.asserts.userps': 'asserts.user',
  'mongodb.asserts.rolloversps': 'asserts.rollovers',
};
