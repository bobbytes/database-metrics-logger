import { PubSub } from '../../../src/helpers/pub-sub';

describe('PubSub', () => {
  class PubSubTest extends PubSub {
    public static messageIds = {
      message1: 'pubSubTest:message1',
      message2: 'pubSubTest:message2',
    };

    public sendMessage(message: string): void {
      this.publish(PubSubTest.messageIds.message1, message);
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

    pubSubTest.subscribe(PubSubTest.messageIds.message1, value => messageReceived = value);
    pubSubTest.sendMessage(testMessage);

    expect(messageReceived).toEqual(testMessage);
  });

  test('subscription callback must not return sent value after unsubscribe is called', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PubSub);

    let messageReceived = '';
    const subscriptionCallback = value => messageReceived = value;

    pubSubTest.subscribe(PubSubTest.messageIds.message1, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(testMessage);

    expect(messageReceived).toEqual(testMessage);

    messageReceived = '';
    pubSubTest.unsubscribe(PubSubTest.messageIds.message1, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(testMessage);

    expect(messageReceived).toEqual('');
  });

  test('subscription callback is only called if not unsubscribed', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PubSub);

    let messageReceived1 = '';
    let messageReceived2 = '';
    const subscriptionCallback1 = value => messageReceived1 = value;
    const subscriptionCallback2 = value => messageReceived2 = value;

    pubSubTest.subscribe(PubSubTest.messageIds.message1, subscriptionCallback1);
    pubSubTest.subscribe(PubSubTest.messageIds.message1, subscriptionCallback2);

    pubSubTest.unsubscribe(PubSubTest.messageIds.message1, subscriptionCallback1);
    pubSubTest.sendMessage(testMessage);

    expect(messageReceived1).toEqual('');
    expect(messageReceived2).toEqual(testMessage);
  });

  test('subscription callback must return sent value after unsubscribe is called for an undefined subscription', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PubSub);

    let messageReceived = '';
    const subscriptionCallback = value => messageReceived = value;

    messageReceived = '';
    pubSubTest.subscribe(PubSubTest.messageIds.message1, subscriptionCallback.bind(this));
    pubSubTest.unsubscribe(PubSubTest.messageIds.message2, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(testMessage);

    expect(messageReceived).toEqual(testMessage);
  });

  test('subscription callback must not return sent value after unsubscribeAll is called', () => {
    expect(pubSubTest).toBeInstanceOf(PubSubTest);
    expect(pubSubTest).toBeInstanceOf(PubSub);

    let messageReceived = '';
    const subscriptionCallback = value => messageReceived = value;

    pubSubTest.subscribe(PubSubTest.messageIds.message1, subscriptionCallback.bind(this));
    pubSubTest.sendMessage(testMessage);

    expect(messageReceived).toEqual(testMessage);

    messageReceived = '';
    pubSubTest.clearAllSubscriptions();
    pubSubTest.sendMessage(testMessage);

    expect(messageReceived).toEqual('');
  });
});
