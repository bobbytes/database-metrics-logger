export const vcap = {
  services: {
    'mongodb-2': [
      {
        label: 'mongodb-2',
        provider: undefined,
        plan: 'small',
        name: 'my-fancy-mongodb-service',
        tags: [
          'mongodb',
        ],
        instance_name: 'my-fancy-mongodb-service',
        binding_name: undefined,
        credentials: {
          host: 'mongodb-host',
          ports: '11111,22222',
          username: 'john',
          password: 'this-is-secret',
          database: 'fancy-database',
          database_uri: 'mongodb://john:this-is-secret@mongodb-host:11111,this-is-secret@mongodb-host:22222?replicaSet=some-replica-set',
          uri: 'mongodb://john:this-is-secret@mongodb-host:11111,this-is-secret@mongodb-host:22222/fancy-database?replicaSet=some-replica-set',
          replica_set: 'some-replica-set',
        },
        syslog_drain_url: undefined,
        volume_mounts: [],
      },
    ],
    'redis-2': [
      {
        label: 'redis-2',
        provider: undefined,
        plan: 'small',
        name: 'my-fancy-redis-service',
        tags: [
          'redis',
        ],
        instance_name: 'my-fancy-redis-service',
        binding_name: undefined,
        credentials: {
          host: 'redis-host',
          port: 33333,
          master_port: 44444,
          slave_ports: [
            55555,
            66666,
          ],
          password: 'this-is-secret',
        },
        syslog_drain_url: undefined,
        volume_mounts: [],
      },
    ],
    'unsupported-service': [
      {
        label: 'unsupported-service',
        provider: undefined,
        plan: 'small',
        name: 'my-fancy-unsupported-service',
        tags: [
          'unsupported-service',
        ],
        instance_name: 'my-fancy-unsupported-service',
        binding_name: undefined,
        credentials: {
          host: 'unsupported-service-host',
          port: 77777,
          user: 'unsupported-user',
          password: 'unsupported-password',
        },
        syslog_drain_url: undefined,
        volume_mounts: [],
      },
    ],
  },
};
