import { IMetricValue } from './metric-value.interface';

export interface IMetricDefinition {
  metric: string;
  getValues: (metrics: any) => IMetricValue[];
  calculateDifferencePerSecond?: boolean;
}
