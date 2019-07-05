import { IMetricValue } from '../../interfaces/metric-value.interface';

export const getReplicationInfoFreeSize = (replicationInfo): IMetricValue[] => {
  return replicationInfo && replicationInfo.logSizeMB && replicationInfo.usedMB
    ? [{ value: replicationInfo.logSizeMB + replicationInfo.usedMB }]
    : [];
};
