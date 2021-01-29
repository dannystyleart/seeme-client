import { isHttpProtocol, isValidStringValue, isValidIPv4Address, withDefaults } from './utils';
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

  if (!isValidStringValue(apiKey)) throw new SeeMeClientError(SeeMeClientExceptions.API_KEY_MISSING);
  if (!isValidStringValue(apiHost)) throw new SeeMeClientError(SeeMeClientExceptions.API_HOST_MISSING);
  if (!isHttpProtocol(apiHost)) throw new SeeMeClientError(SeeMeClientExceptions.API_HOST_PROTOCOL_UNSUPPORTED);
  if (!isValidStringValue(apiPath)) throw new SeeMeClientError(SeeMeClientExceptions.API_PATH_INVALID);

  const request = createApiClient(apiHost);

  const gatewayCall = (params: any = {}) =>
    request(apiPath, {
      ...params,
      key: apiKey,
      format: 'json',
      apiVersion
    });

  const notImplemented = async () => Promise.reject('NOT_YET_IMPLEMENTED');

  return {
    getBalance: async () => gatewayCall({ method: 'balance' }),
    setIP: async (ip: string) => {
      if (!isValidIPv4Address(ip)) throw new SeeMeClientError(SeeMeClientExceptions.SETIP_INVALID_IP);
      return gatewayCall({ method: 'setip', ip });
    },
    sendMessage: notImplemented
  };
};
