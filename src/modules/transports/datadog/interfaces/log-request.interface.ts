export interface ILogRequest {
  message?: string;
  ddsource?: string;
  hostname?: string;
  ddtags?: string;
  [key: string]: string;
}
