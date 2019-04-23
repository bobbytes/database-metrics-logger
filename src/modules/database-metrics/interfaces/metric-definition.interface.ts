export interface IMetricDefinition {
  metric: string;
  calculate?: (metrics: any) => any;
  calculateDifferencePerSecond?: boolean;
}
