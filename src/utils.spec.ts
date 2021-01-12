import { isHttpProtocol, isNonEmptyString, withDefaults } from './utils';

describe('utils', () => {
  const exampleInvalidStringValues = ['', undefined, null, 0, {}, [], () => {}];

  describe('isNonEmptyString(arg) should return', () => {
    test('true if arg is a non empty string', () => {
      expect(isNonEmptyString('asd')).toBe(true);
    });

    test('false when arg is empty string', () => {
      expect(isNonEmptyString('')).toBe(false);
    });

    test('false when arg is not string', () => {
      exampleInvalidStringValues.forEach((value) => expect(isNonEmptyString(value)).toBe(false));
    });
  });

  describe('isHttpProtocol(arg) should return', () => {
    test('true when arg is non empty string and starts with http: or https:', () => {
      const validValues = ['http:', 'http://example.com', 'https:', 'https://example.com'];
      validValues.forEach((value) => expect(isHttpProtocol(value)).toBe(true));
    });

    test('false when arg is not starting with http: or https:', () => {
      const extendedInvalidStringValues = exampleInvalidStringValues.concat(['', 'mailto:', 'mailto:john.doe@example.com', 'ws:', 'ws://example.com']);
      extendedInvalidStringValues.forEach((value) => expect(isHttpProtocol(value)).toBe(false));
    });
  });

  describe('withDefaults(object, defaults) should return', () => {
    const defaults = {
      key: 'value',
      other: 'other value'
    };

    test('merged result of object and defaults arguments', () => {
      const merged = withDefaults(
        {
          myKey: 'hello',
          newField: true
        },
        defaults
      );
      expect(merged).toMatchSnapshot('merged result');

      const overwritten = withDefaults(
        {
          key: 'overwritten value',
          other: 'yet another',
          myKey: 'hello',
          newField: true
        },
        defaults
      );
      expect(overwritten).toMatchSnapshot('overwritten merged result');
    });
  });
});
