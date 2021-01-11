import { isHttpProtocol, isNonEmptyString, withDefaults } from './utils';
import { SeeMeClient, SeeMeClientOptions } from './interfaces';
import { SeeMeClientError, SeeMeClientExceptions } from './exceptions';
import { createApiClient } from './httpClient';

const defaultConfig = {
  apiHost: 'https://seeme.hu',
  apiPath: '/gateway',
  apiVersion: '2.0.1'
};

export const createClient = (options: SeeMeClientOptions): SeeMeClient => {
  const clientOptions = withDefaults(options, defaultConfig) as SeeMeClientOptions;
  const { apiKey, apiHost, apiPath, apiVersion } = clientOptions;

  if (!isNonEmptyString(apiKey)) throw new SeeMeClientError(SeeMeClientExceptions.API_KEY_MISSING);
  if (!isNonEmptyString(apiHost)) throw new SeeMeClientError(SeeMeClientExceptions.API_HOST_MISSING);
  if (!isHttpProtocol(apiHost)) throw new SeeMeClientError(SeeMeClientExceptions.API_HOST_PROTOCOL_UNSUPPORTED);
  if (!isNonEmptyString(apiPath)) throw new SeeMeClientError(SeeMeClientExceptions.API_PATH_INVALID);

  const request = createApiClient(apiHost);

  const gatewayCall = (params: any = {}) =>
    request(apiPath, {
      ...params,
      key: apiKey,
      format: 'json',
      apiVersion
    });

  const notImplemented = () => Promise.reject('NOT_YET_IMPLEMENTED');
  return {
    getBalance: () => gatewayCall({ method: 'balance' }),
    setIP: (ip) => gatewayCall({ method: 'setip', ip }),
    sendMessage: notImplemented
  };
};
