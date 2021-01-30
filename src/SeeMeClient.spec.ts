import * as httpClient from './httpClient';
import { createClient, SendMessageCallbackStatus } from './SeeMeClient';
import { SeeMeClientError, SeeMeClientExceptions } from './exceptions';
import { SeeMeClient, SendMessageOptionalParams } from './interfaces';

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

  describe('sendSMS(number, message, options) should', () => {
    const options = { apiKey: '<api-key>', apiPath: '/endpoint' };
    let client: SeeMeClient;

    beforeEach(() => {
      client = createClient(options);
    });

    test('do an api request correctly with minimum parameters', async () => {
      const number = '123456789';
      const message = 'Have a nice day!';
      const expectedApiClientParams = [
        options.apiPath,
        expect.objectContaining({
          number,
          message
        })
      ];

      await client.sendSMS(number, message);

      expect(apiClient).toHaveBeenCalledWith(...expectedApiClientParams);
    });

    test('do an api request correctly with optional parameters', async () => {
      const number = '123456789';
      const message = 'Have a nice day!';
      const optionalParametersBase: SendMessageOptionalParams = {
        referenceId: '1c79b730-ea76-4ec2-b4a5-fccf1886c537',
        sender: '<sender-number>',
        callbackURL: 'http://mysite.example.com/callback-handler'
      };

      await client.sendSMS(number, message, optionalParametersBase);
      expect(apiClient).toHaveBeenCalledWith(
        options.apiPath,
        expect.objectContaining({
          reference: optionalParametersBase.referenceId,
          sender: optionalParametersBase.sender,
          callbackurl: optionalParametersBase.callbackURL
        })
      );

      const optionalParametersWithAllCallbackStatus: SendMessageOptionalParams = {
        ...optionalParametersBase,
        callbackStatus: 'all'
      };

      await client.sendSMS(number, message, optionalParametersWithAllCallbackStatus);
      expect(apiClient).toHaveBeenLastCalledWith(
        options.apiPath,
        expect.objectContaining({
          reference: optionalParametersBase.referenceId,
          sender: optionalParametersBase.sender,
          callbackurl: optionalParametersBase.callbackURL,
          callback: Object.values(SendMessageCallbackStatus).join(',')
        })
      );

      const optionalParametersWithSingleCallbackStatus: SendMessageOptionalParams = {
        ...optionalParametersBase,
        callbackStatus: SendMessageCallbackStatus.DELIVERED
      };

      await client.sendSMS(number, message, optionalParametersWithSingleCallbackStatus);
      expect(apiClient).toHaveBeenLastCalledWith(
        options.apiPath,
        expect.objectContaining({
          reference: optionalParametersBase.referenceId,
          sender: optionalParametersBase.sender,
          callbackurl: optionalParametersBase.callbackURL,
          callback: `${SendMessageCallbackStatus.DELIVERED}`
        })
      );

      const optionalParametersWithMultipleCallbackStatus: SendMessageOptionalParams = {
        ...optionalParametersBase,
        callbackStatus: [SendMessageCallbackStatus.DELIVERED, SendMessageCallbackStatus.UNDELIVERABLE, SendMessageCallbackStatus.UNKNOWN_DELIVERY_ERROR]
      };

      await client.sendSMS(number, message, optionalParametersWithMultipleCallbackStatus);
      expect(apiClient).toHaveBeenLastCalledWith(
        options.apiPath,
        expect.objectContaining({
          reference: optionalParametersBase.referenceId,
          sender: optionalParametersBase.sender,
          callbackurl: optionalParametersBase.callbackURL,
          callback: [SendMessageCallbackStatus.DELIVERED, SendMessageCallbackStatus.UNDELIVERABLE, SendMessageCallbackStatus.UNKNOWN_DELIVERY_ERROR].join(',')
        })
      );
    });

    test(`throw ${SeeMeClientExceptions.SMS_MESSAGE_NUMBER_MISSING} when number missing or empty`, () => {
      const message = 'Have a nice day!';
      expect(client.sendSMS('', message)).rejects.toThrowError(new SeeMeClientError(SeeMeClientExceptions.SMS_MESSAGE_NUMBER_MISSING));
    });

    test(`throw ${SeeMeClientExceptions.SMS_MESSAGE_MISSING} when message missing or empty`, () => {
      const number = '123456789';
      expect(client.sendSMS(number, '')).rejects.toThrowError(new SeeMeClientError(SeeMeClientExceptions.SMS_MESSAGE_MISSING));
    });

    test(`throw ${SeeMeClientExceptions.SMS_MESSAGE_STATUS_WITHOUT_CALLBACK_URL} when callbackStatus given but callbackURL omitted`, () => {
      const number = '123456789';
      const message = 'Have a nice day!';
      expect(
        client.sendSMS(number, message, {
          callbackStatus: 'all'
        })
      ).rejects.toThrowError(new SeeMeClientError(SeeMeClientExceptions.SMS_MESSAGE_STATUS_WITHOUT_CALLBACK_URL));
    });
  });
});
