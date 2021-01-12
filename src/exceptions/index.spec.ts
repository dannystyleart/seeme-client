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

  test('SeeMeClientError should an alias for Error class', () => {
    const error = new SeeMeClientError('some error');
    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchSnapshot();
  });

  test('SeeMeClientError should an alias for Error class', () => {
    const error = new SeeMeClientError('some error');
    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchSnapshot();
  });

  test('SeeMeErrorResponse should an alias for Error class', () => {
    const error = new SeeMeErrorResponse('some error');
    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchSnapshot();
  });
});
