import { CfServiceMetrics } from '../../../src/classes/cf-service-metrics';
import { Logger } from '../utils/logger';

describe('CloudFoundry', () => {
  let cfServiceMetrics: CfServiceMetrics;
  const logger = new Logger();

  beforeEach(() => {
    cfServiceMetrics = new CfServiceMetrics(logger);
  });

  test('', () => {
    expect(cfServiceMetrics).toBeInstanceOf(CfServiceMetrics);

    // TODO: implement mocker for service metrics
    // cfServiceMetrics.start();
    // cfServiceMetrics.stop();
  });
});
