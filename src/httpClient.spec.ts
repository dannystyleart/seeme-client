import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { HttpClientRequest } from './interfaces/httpClient';
import { createApiClient } from './httpClient';

const mockApiUrl = 'http://api.example.com';
const server = setupServer(
  rest.get(`${mockApiUrl}/*`, (req, res, context) => {
    return res(
      context.json({
        message: 'Reponse from mock server',
        requestedUrl: req.url.toString()
      })
    );
  })
);

describe('httpClient', () => {
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });

  test('createApiClient(apiUrl) should return a request method', () => {
    expect(createApiClient(mockApiUrl)).toBeInstanceOf(Function);
  });

  describe('request(path, params)', () => {
    let request: HttpClientRequest;
    beforeEach(() => {
      request = createApiClient(mockApiUrl);
    });

    test('should return parsed json response sent to given api endpoint defined by path argument', async () => {
      const result = await (<any>request('/hello'));
      expect(result).toMatchSnapshot();
    });

    test('should return parsed response sent to given api endpoint defined by path and params arguments', async () => {
      const result = await (<any>request('/hello', {
        search: 'some search term',
        flagged: true,
        someList: [1, 2, 3]
      }));
      expect(result).toMatchSnapshot();
    });

    test('should not append query params when params is empty object', async () => {
      const result = await (<any>request('/hello', {}));
      expect(result).toMatchSnapshot();
    });

    test('should fail the promise when server response with error', async () => {
      server.use(
        rest.get(`${mockApiUrl}/failing-api`, (req, res) => {
          return res.networkError('Something failed');
        })
      );

      const failHandler = jest.fn();
      await request('/failing-api').catch(failHandler);
      expect(failHandler).toHaveBeenCalled();
    });
  });
});
