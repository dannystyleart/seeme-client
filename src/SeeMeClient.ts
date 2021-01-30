import { isHttpProtocol, isValidStringValue, isValidIPv4Address, withDefaults } from './utils';
import { SeeMeClient, SeeMeClientOptions, SendMessageOptionalParams } from './interfaces';
import { SeeMeClientError, SeeMeClientExceptions } from './exceptions';
import { createApiClient } from './httpClient';

const defaultConfig = {
  apiHost: 'https://seeme.hu',
  apiPath: '/gateway',
  apiVersion: '2.0.1'
};

export enum SendMessageCallbackStatus {
  UNKNOWN_DELIVERY_ERROR = 1,
  SENDING_STOPPED = 2,
  TRANSMITTED_TO_REMOTE_SMSC = 3,
  ACCEPTED_BY_REMOTE_SMSC = 4,
  REJECTED_BY_REMOTE_SMSC = 5,
  DELIVERED = 6,
  UNDELIVERABLE = 7,
  WAITING_FOR_TARGET_DEVICE = 8,
  VALIDITY_EXPIRED = 9,
  MISSING_STATUS = 10
}

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

  const sendSMS = async (number: string | number, message: string, optionalParams: SendMessageOptionalParams = {}) => {
    const { callbackURL, callbackStatus, sender, referenceId } = optionalParams;
    const params: { [key: string]: string | undefined } = {
      number: `${number}`.trim(),
      message: (message && message.trim()) || undefined,
      callbackurl: (callbackURL && callbackURL.trim()) || undefined,
      sender: (sender && sender.trim()) || undefined,
      reference: (typeof referenceId !== 'undefined' && `${referenceId}`.trim()) || undefined
    };

    if (!isValidStringValue(params.number)) {
      throw new SeeMeClientError(SeeMeClientExceptions.SMS_MESSAGE_NUMBER_MISSING);
    }

    if (!isValidStringValue(params.message) || params.message.length < 1) {
      throw new SeeMeClientError(SeeMeClientExceptions.SMS_MESSAGE_MISSING);
    }

    if (callbackStatus) {
      if (!isValidStringValue(params.callbackurl)) throw new SeeMeClientError(SeeMeClientExceptions.SMS_MESSAGE_STATUS_WITHOUT_CALLBACK_URL);
      params.callback = Array.isArray(callbackStatus)
        ? callbackStatus.join(',')
        : callbackStatus === 'all'
        ? Object.values(SendMessageCallbackStatus).join(',')
        : `${callbackStatus}`;
    }

    return gatewayCall(params);
  };

  return {
    getBalance: async () => gatewayCall({ method: 'balance' }),
    setIP: async (ip: string) => {
      if (!isValidIPv4Address(ip)) throw new SeeMeClientError(SeeMeClientExceptions.SETIP_INVALID_IP);
      return gatewayCall({ method: 'setip', ip });
    },
    sendSMS
  };
};
