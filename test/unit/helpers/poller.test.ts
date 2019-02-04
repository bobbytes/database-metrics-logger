import { Poller } from '../../../src/helpers/poller';

describe('Poller', () => {
  let poller: Poller;

  jest.useFakeTimers();

  test('callback must be called with interval config', () => {
    poller = new Poller({ interval: 2000 });
    expect(poller).toBeInstanceOf(Poller);

    const pollerCallback = jest.fn();
    poller.onPoll(pollerCallback.bind(this));
    poller.poll();

    expect(pollerCallback).not.toBeCalled();
    jest.runAllTimers();
    expect(pollerCallback).toBeCalled();
  });

  test('callback must be called without interval config', () => {
    poller = new Poller();
    expect(poller).toBeInstanceOf(Poller);

    const pollerCallback = jest.fn();
    poller.onPoll(pollerCallback.bind(this));
    poller.poll();

    expect(pollerCallback).not.toBeCalled();
    jest.runAllTimers();
    expect(pollerCallback).toBeCalled();
  });
});

