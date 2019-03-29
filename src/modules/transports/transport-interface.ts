export interface ITransportInterface {
  postMetrics(metrics: {}): Promise<any>;
}
