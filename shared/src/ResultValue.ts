export class ResultValue<T, E = Error> {
  private readonly _value?: T;
  private readonly _error?: E;
  private readonly _isOk: boolean;

  private constructor(isOk: boolean, value?: T, error?: E) {
    this._isOk = isOk;
    this._value = value;
    this._error = error;
    Object.freeze(this);
  }

  static ok<T, E = Error>(value: T): ResultValue<T, E> {
    return new ResultValue<T, E>(true, value);
  }

  static fail<T, E = Error>(error: E): ResultValue<T, E> {
    return new ResultValue<T, E>(false, undefined, error);
  }

  get isOk(): boolean {
    return this._isOk;
  }

  get isFailure(): boolean {
    return !this._isOk;
  }

  get value(): T {
    if (!this._isOk) {
      throw new Error('Cannot get value of a failed result');
    }
    return this._value as T;
  }

  get error(): E {
    if (this._isOk) {
      throw new Error('Cannot get error of a successful result');
    }
    return this._error as E;
  }
}
