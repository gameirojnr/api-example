import { AsyncLocalStorage } from 'async_hooks';

const CORRELATION_ID_KEY = 'correlationId';

export class RequestContextService {
  private static als = new AsyncLocalStorage<Map<string, unknown>>();

  static get<T>(key: string): T | undefined {
    const store = this.als.getStore();
    return store ? (store.get(key) as T) : undefined;
  }

  static set(key: string, value: unknown): void {
    const store = this.als.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  static run<R>(defaults: Map<string, unknown>, callback: () => R): R {
    return this.als.run(defaults, callback);
  }

  static startRequest<R>(callback: () => R): R {
    return this.als.run(new Map<string, unknown>(), callback);
  }

  static getCorrelationId(): string | undefined {
    return this.get<string>(CORRELATION_ID_KEY);
  }

  static setCorrelationId(id: string): void {
    this.set(CORRELATION_ID_KEY, id);
  }
}
