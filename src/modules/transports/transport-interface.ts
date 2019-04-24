import { IMetricsResponse } from '../../interfaces';

export interface ITransportInterface {
  postMetrics(metrics: IMetricsResponse): Promise<any>;
}
