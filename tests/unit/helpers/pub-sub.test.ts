import { PubSub } from '../../../src/helpers/pub-sub';

describe('PubSub', () => {
  class PubSubTest extends PubSub {
    public static messageId = 'pubSubTest:message';

    public sendMessage(message: string): void {
      this.publish(PubSubTest.messageId, message);
    }

    public clearAllSubscriptions(): void {
      this.unsubscribeAll();
    }
  }

  let pubSubTest: PubSubTest;
  const testMessage = 'Hello World';

  beforeEach(() => {
    pubSubTest = new PubSubTest();
  });

  test('subscription callback must return sent value', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PubSub);

    let messageReceived = '';

    pubSubTest.subscribe(PubSubTest.messageId, value => messageReceived = value);
    pubSubTest.sendMessage(testMessage);

    expect(messageReceived).toEqual(testMessage);
  });

  test('subscription callback must not return sent value after unsubscribe is called', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PubSub);

    let messageReceived = '';
    const subscriptionCallback = value => messageReceived = value;

    pubSubTest.subscribe(PubSubTest.messageId, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(testMessage);

    expect(messageReceived).toEqual(testMessage);

    messageReceived = '';
    pubSubTest.unsubscribe(PubSubTest.messageId, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(testMessage);

    expect(messageReceived).toEqual('');
  });

  test('subscription callback must not return sent value after unsubscribeAll is called', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PubSub);

    let messageReceived = '';
    const subscriptionCallback = value => messageReceived = value;

    pubSubTest.subscribe(PubSubTest.messageId, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(testMessage);

    expect(messageReceived).toEqual(testMessage);

    messageReceived = '';
    pubSubTest.clearAllSubscriptions();
    pubSubTest.sendMessage(testMessage);

    expect(messageReceived).toEqual('');
  });
});
