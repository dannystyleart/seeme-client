import { SeeMeClientError } from './SeeMeClientError';
import { SeeMeErrorResponse } from './SeeMeErrorResponse';
import { SeeMeClientExceptions } from './SeeMeClientExceptions';
import * as exportedModules from './index';

describe('exceptions', () => {
  test('should export correct submodules', () => {
    expect(exportedModules).toMatchSnapshot();
  });

  test('SeeMeClientExceptions should contain correct enum values', () => {
    expect(SeeMeClientExceptions).toMatchSnapshot();
  });

  [SeeMeClientError, SeeMeErrorResponse].forEach((exceptionClass) =>
    test(`${exceptionClass.name} should be customized Error class`, () => {
      const instance = new exceptionClass('some error');
      expect(instance).toBeInstanceOf(Error);
      expect(instance).toMatchSnapshot();
    })
  );
});
