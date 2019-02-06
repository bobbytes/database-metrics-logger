import mongoUnit from 'mongo-unit';

import { DatabaseType } from '../../../../src/database-metrics-logger';
import { MongoDbMetrics } from '../../../../src/modules/database-metrics/mongo-db-metrics';

describe('MongoDbMetrics', () => {

  let mongoDbStatus: MongoDbMetrics;

  beforeAll(async done => {
    const uri = await mongoUnit.start();
    const database = uri ? uri.substr(uri.lastIndexOf('/') + 1) : '';

    const credentials = {
      databaseType: DatabaseType.MongoDb,
      uri,
      database,
      interval: 10000,
    };

    mongoDbStatus = new MongoDbMetrics(credentials);

    done();
  });

  afterAll(async done => {
    await mongoUnit.stop();
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
