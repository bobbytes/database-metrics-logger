import { MongoDbStatus } from '../../../../src/classes/database-status/mongo-db-status';
import mongoUnit from 'mongo-unit';

describe.skip('CloudFoundry', () => {
  let mongoDbStatus: MongoDbStatus;
  let database_uri = '';

  // jest.useFakeTimers();

  beforeAll(async done => {
    database_uri = await mongoUnit.start();
    const database = database_uri ? database_uri.substr(database_uri.lastIndexOf('/') + 1) : '';

    const mongoDbCredentials = {
      database_uri,
      database,
    };

    const mongoDBOptions = {
      serverStatusInterval: 1,
      dbStatsInterval: 1,
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

  test('', () => {
    expect(mongoDbStatus).toBeInstanceOf(MongoDbStatus);

    const serverStatusCallback = serverStatus => {
      expect(serverStatus).toBeDefined();
    };

    mongoDbStatus.getServerStatus().subscribe(MongoDbStatus.subscriptionIds.serverStatus, serverStatusCallback);
    // jest.runAllTimers();
  });
});
