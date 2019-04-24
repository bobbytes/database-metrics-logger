export enum ReplicationSetMemberState {
  Startup = 0,
  Primary = 1,
  Secondary = 2,
  Recovering = 3,
  Startup2 = 5,
  Unknown = 6,
  Arbiter = 7,
  Down = 8,
  Rollback = 9,
  Removed = 10,
}
