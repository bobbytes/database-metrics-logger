import { logger, LoggerLevel } from '../../../src/helpers/logger';

describe.skip('logger', () => {
  afterEach(() => {
    logger.unsubscribeAll();
  });

  test('must return an debug level log', () => {
    const messageToSend = 'this is a debug message';

    const loggerCallback = ({ message, level }) => {
      expect(message).toEqual(messageToSend);
      expect(level).toEqual(LoggerLevel.Debug);
    };

    logger.subscribe(undefined, loggerCallback);
    logger.debug(messageToSend);
  });

  test('must return an info level log', () => {
    const messageToSend = 'this is a info message';

    const loggerCallback = ({ message, level }) => {
      expect(message).toEqual(messageToSend);
      expect(level).toEqual(LoggerLevel.Info);
    };

    logger.subscribe(undefined, loggerCallback);
    logger.info(messageToSend);
  });

  test('must return an warn level log', () => {
    const messageToSend = 'this is a warn message';

    const loggerCallback = ({ message, level }) => {
      expect(message).toEqual(messageToSend);
      expect(level).toEqual(LoggerLevel.Warn);
    };

    logger.subscribe(undefined, loggerCallback);
    logger.warn(messageToSend);
  });

  test('must return an error level log', () => {
    const messageToSend = 'this is an error message';

    const loggerCallback = ({ message, level }) => {
      expect(message).toEqual(messageToSend);
      expect(level).toEqual(LoggerLevel.Error);
    };

    logger.subscribe(undefined, loggerCallback);
    logger.error(messageToSend);
  });
});
