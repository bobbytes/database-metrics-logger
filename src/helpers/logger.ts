import { PubSub } from '../helpers/pub-sub';

export enum LoggerLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

class Logger extends PubSub {
  public debug(message: any): void {
    this.publish(undefined, { level: LoggerLevel.Debug, message });
  }

  public info(message: any): void {
    this.publish(undefined, { level: LoggerLevel.Info, message });
  }

  public warn(message: any): void {
    this.publish(undefined, { level: LoggerLevel.Warn, message });
  }

  public error(message: any): void {
    this.publish(undefined, { level: LoggerLevel.Error, message });
  }
}

export const logger = new Logger();

/**
 * handle promise rejection
 */
process.on('unhandledRejection', error => {
  logger.error(error);
});
