export interface IMongoDbOptions {
  serverStatusInterval?: number;
  dbStatsInterval?: number;
}

export interface IRedisOptions {
  infoInterval?: number;
}

export interface IServiceMetricsOptions {
  mongoDB?: IMongoDbOptions;
  redis?: IRedisOptions;
  vcap?: {};
  vcapFile?: string;
}

export type TDbOptions = IMongoDbOptions | IRedisOptions;
