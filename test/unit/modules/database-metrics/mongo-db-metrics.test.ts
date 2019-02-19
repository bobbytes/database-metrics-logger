import { DatabaseType } from '../../../../src/database-metrics-logger';
import {
    MongodbMetrics
} from '../../../../src/modules/database-metrics/mongodb-metrics/mongodb-metrics';

describe.skip('MongodbMetrics', () => {
  let mongodbMetrics: MongodbMetrics;

  beforeAll(() => {
    const credentials = {
      databaseType: DatabaseType.Mongodb,
      uri: (global as any).__MONGO_URI__,
      database: (global as any).__MONGO_DB_NAME__,
      interval: 1,
    };

    mongodbMetrics = new MongodbMetrics(credentials);
  });

  afterAll(() => {
    mongodbMetrics.stop();
  });

  test.skip('must return Mongodb server status', async done => {
    expect(mongodbMetrics).toBeInstanceOf(MongodbMetrics);

    const databaseMetricsCallback = metrics => {
      expect(metrics).toBeDefined();
      done();
    };

    await mongodbMetrics.getMetrics().subscribe(undefined, databaseMetricsCallback.bind(this));
  });
});
