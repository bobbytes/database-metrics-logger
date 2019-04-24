import { IOperationTime } from './operation-time.interface';

export interface IOperationTimes {
  appliedOpTime: IOperationTime;
  durableOpTime: IOperationTime;
  lastCommittedOpTime: IOperationTime;
  readConcernMajorityOpTime: IOperationTime;
}
