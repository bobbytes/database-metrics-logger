import { Timestamp } from 'bson';

import { IClusterTimeSignature } from './cluster-time-signature.interface';

export interface IClusterTime {
  clusterTime: Timestamp;
  signature: IClusterTimeSignature;
}
