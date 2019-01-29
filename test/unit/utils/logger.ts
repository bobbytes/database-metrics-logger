import { ILogger } from '../../../src/interfaces/logger.interface';

export class Logger implements ILogger {
  public debug = jest.fn((message: string, ...args: any[]) => undefined);
  public info = jest.fn((message: string, ...args: any[]) => undefined);
  public warn = jest.fn((message: string, ...args: any[]) => undefined);
  public error = jest.fn((message: string, ...args: any[]) => undefined);
}
