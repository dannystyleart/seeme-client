import * as httpClient from './httpClient';
import { createClient } from './SeeMeClient';
import { SeeMeClientError, SeeMeClientExceptions } from './exceptions';

jest.mock('./httpClient');
describe('SeeMeClient', () => {
  let httpApiClientFactory: jest.MockedFunction<any>;
  let apiClient: jest.MockedFunction<any>;
  beforeAll(() => {
    httpApiClientFactory = jest.fn();
    (httpClient.createApiClient as jest.MockedFunction<any>).mockImplementation(httpApiClientFactory);
  });

  beforeEach(() => {
    apiClient = jest.fn();
    apiClient.mockResolvedValue({});

    httpApiClientFactory.mockReturnValue(apiClient);
  });

  afterEach(() => {
    httpApiClientFactory.mockReset();
  });

  describe('creating client should', () => {
    test(`throw ${SeeMeClientExceptions.API_KEY_MISSING} error when option 'apiKey' not provided`, () => {
      const expectedError = new SeeMeClientError(SeeMeClientExceptions.API_KEY_MISSING);
      expect(() => createClient({} as any)).toThrowError(expectedError);
    });

    test(`throw ${SeeMeClientExceptions.API_HOST_MISSING} error when provided 'apiHost' option with empty value`, () => {
      const expectedError = new SeeMeClientError(SeeMeClientExceptions.API_HOST_MISSING);
      const options = {
        apiKey: '<api-key>',
        apiHost: ''
      };

      expect(() => createClient(options)).toThrowError(expectedError);
    });

    test(`throw ${SeeMeClientExceptions.API_HOST_PROTOCOL_UNSUPPORTED} error when provided 'apiHost' option with non http url`, () => {
      const expectedError = new SeeMeClientError(SeeMeClientExceptions.API_HOST_PROTOCOL_UNSUPPORTED);
      const options = {
        apiKey: '<api-key>',
        apiHost: 'ws://example.com:3000'
      };

      expect(() => createClient(options)).toThrowError(expectedError);
    });

    test(`throw ${SeeMeClientExceptions.API_PATH_INVALID} error when provided 'apiPath' option with empty value`, () => {
      const expectedError = new SeeMeClientError(SeeMeClientExceptions.API_PATH_INVALID);
      const options = {
        apiKey: '<api-key>',
        apiPath: ''
      };

      expect(() => createClient(options)).toThrowError(expectedError);
    });

    test('return configured client', () => {
      const options = {
        apiKey: '<api-key>',
        apiHost: 'http://example.com'
      };

      const result = createClient(options);

      expect(httpApiClientFactory).toHaveBeenCalledWith(options.apiHost);
      expect(result).toMatchSnapshot();
    });
  });

  describe('getBalance() should', () => {
    test('do api request correctly', async () => {
      const options = {
        apiKey: '<api-key>',
        apiHost: 'http://example.com',
        apiPath: '/endpoint'
      };
      const expectedApiClientParams = [
        options.apiPath,
        expect.objectContaining({
          method: 'balance',
          key: options.apiKey
        })
      ];
      await createClient(options).getBalance();

      expect(apiClient).toHaveBeenCalledWith(...expectedApiClientParams);
    });
  });

  describe('setIP(ip) should', () => {
    test(`throw ${SeeMeClientExceptions.SETIP_INVALID_IP} error for invalid ip param`, () => {
      const client = createClient({
        apiKey: '<api-key>'
      });

      [false, 1, '', 'random text'].forEach((ip) => {
        const probe = () => client.setIP(ip as any);
        const expectedError = new SeeMeClientError(SeeMeClientExceptions.SETIP_INVALID_IP);

        expect(probe).rejects.toThrowError(expectedError);
      });
    });

    test('do api request correctly', async () => {
      const testIp = '127.0.0.1';
      const options = {
        apiKey: '<api-key>',
        apiHost: 'http://example.com',
        apiPath: '/endpoint'
      };
      const expectedApiClientParams = [
        options.apiPath,
        expect.objectContaining({
          method: 'setip',
          ip: testIp,
          key: options.apiKey
        })
      ];

      await createClient(options).setIP(testIp);

      expect(apiClient).toHaveBeenCalledWith(...expectedApiClientParams);
    });
  });
});
