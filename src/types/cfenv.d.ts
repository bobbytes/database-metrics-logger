declare module 'cfenv' {
  interface IAppEnvOptions {
    name?: string;
    vcap?: {},
    vcapFile?: string;
  }

  export interface IRedisCredentials {
    host: string;
    port: number;
    master_port: number;
    slave_ports: number[];
    password: string;
  }

  export interface IMongoDbCredentials {
    database_uri: string;
    host?: string;
    ports?: string[];
    username?: string;
    password?: string;
    database?: string;
    uri?: string;
    replica_set?: string;
  }

  export type TCredentials = IMongoDbCredentials | IRedisCredentials;

  export interface IService<> {
    label: string;
    provider: string;
    plan: string;
    name: string;
    tags: string[];
    instance_name: string;
    binding_name: string;
    credentials: TCredentials;
    syslog_drain_url: string;
    volume_mounts: string[];
  }

  export interface IAppEnv {
    getServices(): IService[];
    getServiceCreds(serviceName: RegExp | string): TCredentials;
  }

  export function getAppEnv(option?: IAppEnvOptions): IAppEnv;
}
