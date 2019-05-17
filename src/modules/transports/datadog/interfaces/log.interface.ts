import { LogStatus } from '../enums';
import { ILogAttributesMap } from './log-attributes-map.interface';

export interface ILog {
  message?: string;
  ddsource?: string;
  hostname?: string;
  service?: string;
  status?: LogStatus;
  ddtags?: string[];
  attributesMap?: ILogAttributesMap;
}
