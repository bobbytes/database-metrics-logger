import { DatabaseType } from '../../../../src/database-metrics-logger';
import { MongoDbMetrics } from '../../../../src/modules/database-metrics/mongo-db-metrics';

describe.skip('MongoDbMetrics', () => {
  let mongoDbMetrics: MongoDbMetrics;

  beforeAll(() => {
    const credentials = {
      databaseType: DatabaseType.MongoDb,
      uri: (global as any).__MONGO_URI__,
      database: (global as any).__MONGO_DB_NAME__,
      interval: 1,
    };

    mongoDbMetrics = new MongoDbMetrics(credentials);
  });

  afterAll(() => {
    mongoDbMetrics.stop();
  });

  test.skip('must return MongoDb server status', async done => {
    expect(mongoDbMetrics).toBeInstanceOf(MongoDbMetrics);

    const databaseMetricsCallback = metrics => {
      expect(metrics).toBeDefined();
      done();
    };

    await mongoDbMetrics.getMetrics().subscribe(undefined, databaseMetricsCallback.bind(this));
  });
});
