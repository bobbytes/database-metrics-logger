import { Collection, MongoClient } from 'mongodb';

import { IReplicationInfo } from '../interfaces/replication-info.interface';

const oplogCollectionName = 'oplog.rs';

const getOplogCollection = async (mongoClient: MongoClient): Promise<Collection<any>> => {
  const database = mongoClient.db('local');

  const collections = await database.collections();
  const collectionName = collections.find(collection => collection.collectionName === oplogCollectionName);

  if (!collectionName) {
    return Promise.reject({ errmsg: 'replication not detected' });
  }

  return database.collection(oplogCollectionName);
};

const getOplogStats = async (oplogCollection: Collection<any>): Promise<any> => {
  const oplogStats = await oplogCollection.stats();
  const errmsg = `Could not get stats for local. ${oplogCollectionName} collection. collstats returned: ${JSON.stringify(oplogStats)}`;

  return oplogStats && oplogStats.maxSize
    ? oplogStats
    : { errmsg };
};

const getOplogSize = async (oplogCollection: Collection<any>): Promise<any> => {
  const oplogStats = await getOplogStats(oplogCollection);

  if (oplogStats.errmsg) {
    return oplogStats;
  }

  const logSizeMB = oplogStats.maxSize / (1024 * 1024);
  const size = oplogStats.size / (1024 * 1024);
  const usedMB = Math.ceil(size * 100) / 100;

  return {
    logSizeMB,
    usedMB,
  };
};

const calculateOplogTimestamps = async (first, last): Promise<any> => {
  const fistOplogTime = new Date(first.ts.getHighBits() * 1000).getTime();
  const lastOplogTime = new Date(last.ts.getHighBits() * 1000).getTime();
  const timeDiff = lastOplogTime - fistOplogTime;

  const timeDiffHours = Math.round(timeDiff / 36) / 100;

  return {
    timeDiff,
    timeDiffHours,
    tFirst: fistOplogTime,
    tLast: lastOplogTime,
    now: new Date().getTime(),
  };
};

const getOperationsTimestamps = async (oplogCollection: Collection<any>) => {
  const firstOplog = oplogCollection.find().sort({ $natural: 1 }).limit(1);
  const lastOplog = oplogCollection.find().sort({ $natural: -1 }).limit(1);

  const hasFirstOplogNext = await firstOplog.hasNext();
  const hasLastOplogNext = await lastOplog.hasNext();

  if (!hasFirstOplogNext || !hasLastOplogNext) {
    const errmsg = 'objects not found in local.oplog.$main -- is this a new and empty db instance?';
    const oplogMainRowCount = await oplogCollection.count();
    return { errmsg, oplogMainRowCount };
  }

  const first = await firstOplog.next();
  const last = await lastOplog.next();

  return first.ts && last.ts
    ? calculateOplogTimestamps(first, last)
    : { errmsg: 'ts element not found in oplog objects' };
};

export const getReplicationInfo = async (mongoClient: MongoClient): Promise<IReplicationInfo> => {
  let oplogCollection;

  try {
    oplogCollection = await getOplogCollection(mongoClient);
  } catch (error) {
    return error;
  }

  const oplogStats = await getOplogSize(oplogCollection);

  if (oplogStats.errmsg) {
    return oplogStats;
  }

  const timestamps = await getOperationsTimestamps(oplogCollection);

  return {
    ...oplogStats,
    ...timestamps,
  };
};
