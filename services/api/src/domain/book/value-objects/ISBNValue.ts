import { ResultValue } from '@shared';
import { InvalidISBNError } from '../errors/InvalidISBNError';

export class ISBNValue {
  private constructor(private readonly _value: string) {
    Object.freeze(this);
  }

  static create(raw: string): ResultValue<ISBNValue, InvalidISBNError> {
    const digits = raw.replace(/[-\s]/g, '');

    if (!/^\d{13}$/.test(digits)) {
      return ResultValue.fail(new InvalidISBNError(raw));
    }

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(digits[i], 10) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;

    if (checkDigit !== parseInt(digits[12], 10)) {
      return ResultValue.fail(new InvalidISBNError(raw));
    }

    return ResultValue.ok(new ISBNValue(digits));
  }

  get value(): string {
    return this._value;
  }

  get formatted(): string {
    return `${this._value.slice(0, 3)}-${this._value.slice(3, 4)}-${this._value.slice(4, 6)}-${this._value.slice(6, 12)}-${this._value.slice(12)}`;
  }

  equals(other: ISBNValue): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
