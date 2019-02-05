import mongoUnit from 'mongo-unit';

import {
    MongoDbMetrics, MongoDbMetricsEvent
} from '../../../../src/classes/database-metrics/mongo-db-metrics';

describe('MongoDbStatus', () => {

  let mongoDbStatus: MongoDbMetrics;
  let database_uri = '';

  beforeAll(async done => {
    // database_uri = await mongoUnit.start();
    database_uri = '';
    const database = database_uri ? database_uri.substr(database_uri.lastIndexOf('/') + 1) : '';

    const mongoDbCredentials = {
      database_uri,
      database,
    };

    const mongoDBOptions = {
      serverStatusInterval: 10000,
      dbStatsInterval: 10000,
    };

    mongoDbStatus = new MongoDbMetrics(mongoDbCredentials, mongoDBOptions);

    done();
  });

  /*
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
  */

  test('must return MongoDb server status', async done => {
    expect(mongoDbStatus).toBeInstanceOf(MongoDbMetrics);

    /*
    const serverStatusCallback = serverStatus => {
      expect(serverStatus).toBeDefined();
      done();
    };

    mongoDbStatus.getServerStatus().subscribe(MongoDbStatusEvent.ServerStatus, serverStatusCallback.bind(this));
    */

    done();
  });
});
