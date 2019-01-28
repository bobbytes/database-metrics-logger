import { Poller } from '../../../src/helpers/poller';

describe('Poller', () => {
  let poller: Poller;

  beforeEach(() => {
    poller = new Poller({ interval: 2000 });
  });

  jest.useFakeTimers();

  test('callback must be called', () => {
    expect(poller).toBeInstanceOf(Poller);

    const pollerCallback = jest.fn();
    poller.onPoll(pollerCallback.bind(this));
    poller.poll();

    expect(pollerCallback).not.toBeCalled();
    jest.runAllTimers();
    expect(pollerCallback).toBeCalled();
  });
});
