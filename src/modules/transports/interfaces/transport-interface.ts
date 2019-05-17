import { IMetricsResponse } from '../../../interfaces';

export interface ITransportInterface {
  post(metrics: IMetricsResponse): Promise<any>;
}
