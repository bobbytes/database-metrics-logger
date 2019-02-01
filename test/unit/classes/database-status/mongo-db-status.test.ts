import mongoUnit from 'mongo-unit';

import {
    MongoDbStatus, MongoDbStatusEvent
} from '../../../../src/classes/database-status/mongo-db-status';

describe.skip('CloudFoundry', () => {
  let mongoDbStatus: MongoDbStatus;
  let database_uri = '';

  beforeAll(async done => {
    database_uri = await mongoUnit.start();
    const database = database_uri ? database_uri.substr(database_uri.lastIndexOf('/') + 1) : '';

    const mongoDbCredentials = {
      database_uri,
      database,
    };

    const mongoDBOptions = {
      serverStatusInterval: 10000,
      dbStatsInterval: 10000,
    };

    mongoDbStatus = new MongoDbStatus(mongoDbCredentials, mongoDBOptions);

    done();
  });

  beforeEach(async done => {
    const mongoData = {
      cars: [
        {
          manufacturer: 'tesla',
          model: 'model x',
          color: 'black',
        },
      ],
    };

    await mongoUnit.initDb(database_uri, mongoData);
    done();
  });

  afterEach(async done => {
    await mongoUnit.drop();
    done();
  });

  afterAll(async done => {
    await mongoUnit.stop();
    done();
  });

  test('must return MongoDb server status', async done => {
    expect(mongoDbStatus).toBeInstanceOf(MongoDbStatus);

    const serverStatusCallback = serverStatus => {
      expect(serverStatus).toBeDefined();
      done();
    };

    mongoDbStatus.getServerStatus().subscribe(MongoDbStatusEvent.ServerStatus, serverStatusCallback.bind(this));
  });
});
