type TMessage = {} | string;

export interface ILogger {
  debug(message: TMessage): void;
  info(message: TMessage): void;
  warn(message: TMessage): void;
  error(message: TMessage): void;
}
