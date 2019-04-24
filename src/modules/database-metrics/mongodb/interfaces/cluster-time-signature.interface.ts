import { Binary } from 'bson';

export interface IClusterTimeSignature {
  hash: Binary;
  keyId: number;
}
