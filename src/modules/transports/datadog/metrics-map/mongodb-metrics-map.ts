export const mongoDbMetricsMap = {
  // read requests per second
  'mongodb.opcounters.getmoreps': 'opcounters.getmore', // wrong
  'mongodb.opcounters.queryps': 'opcounters.query', // wrong

  // write requests per second
  'mongodb.opcounters.deleteps': 'opcounters.delete', // wrong
  'mongodb.opcounters.insertps': 'opcounters.insert', // wrong
  'mongodb.opcounters.updateps': 'opcounters.update', // wrong

  // number of clients with reads in progress or queued
  'mongodb.globallock.activeclients.readers': 'globalLock.activeClients.readers', // okay

  // number of clients with writes in progress or queued
  'mongodb.globallock.activeclients.writers': 'globalLock.activeClients.writers', // okay

  // queued read and write requests per second
  'mongodb.globallock.currentqueue.readers': 'globalLock.currentQueue.readers', // okay
  'mongodb.globallock.currentqueue.writers': 'globalLock.currentQueue.writers', // okay

  // percentage of client connections used (%)
  'mongodb.connections.current': 'connections.current', // okay
  'mongodb.connections.available': 'connections.available', // okay

  // max memory usage
  'mongodb.mem.mapped': 'mem.mapped', // okay
  'mongodb.mem.resident': 'mem.resident', // okay
  'mongodb.mem.virtual': 'mem.virtual', // okay

  // number of page faults per host
  'mongodb.extra_info.page_faultsps': 'extra_info.page_faults', // might be wrong

  // data size per replica set
  'mongodb.stats.datasize': 'metrics.dbStats.dataSize', // okay

  // oplog window per replica set
  'mongodb.oplog.timediffseconds': '', // check

  // max Replication Lag per replica set
  // 'mongodb.replset.replicationlag': '', // ? needs to be calculated

  // number of open cursors per replica set
  'mongodb.metrics.cursor.open.total': 'metrics.cursor.open.total', // okay

  // number of timed out cursors per replica set
  'mongodb.cursors.timedout': 'metrics.cursors.timedOut', // okay

  // number of asserts per second
  'mongodb.asserts.msgps': 'asserts,msg',
  'mongodb.asserts.warningps': 'asserts.warning',
  'mongodb.asserts.regularps': 'asserts.regular',
  'mongodb.asserts.userps': 'asserts.user',
  'mongodb.asserts.rolloversps': 'asserts.rollovers',
};
