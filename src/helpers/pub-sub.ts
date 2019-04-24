type TCallback = (value: any) => void;

export abstract class PubSub {
  private subscribers = new Map<string, TCallback[]>();

  public subscribe(id: string = '', callback: TCallback): void {
    const callbacks = this.subscribers.get(id) || [];
    this.subscribers.set(id, [...callbacks, callback]);
  }

  public unsubscribe(id: string = '', callback: TCallback): void {
    const callbacks = this.subscribers.get(id) || [];
    const filteredCallbacks = callbacks.filter(filteredCallback => filteredCallback.toString() !== callback.toString());
    this.subscribers.set(id, filteredCallbacks);
  }

  public unsubscribeAll(): void {
    this.subscribers.forEach((_callbacks, id) => this.subscribers.set(id, []));
  }

  protected publish(id: string = '', value: any): void {
    const callbacks = this.subscribers.get(id) || [];
    callbacks.forEach(subscriber => subscriber(value));
  }
}
