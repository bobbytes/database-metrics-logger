export interface IReplicationInfo {
  logSizeMB?: number;
  usedMB?: number;
  errmsg?: string;
  oplogMainRowCount?: number;
  timeDiff?: number;
  timeDiffHours?: number;
  tFirst?: number;
  tLast?: number;
  now?: number;
}
