import { SendMessageCallbackStatus } from '../SeeMeClient';

export interface SeeMeClient {
  getBalance(): Promise<any>;
  setIP(ipAddress: string): Promise<any>;
  sendSMS(number: string, message: string, optionalParams?: SendMessageOptionalParams): Promise<any>;
}

export interface SendMessageOptionalParams {
  sender?: string;
  referenceId?: string | number;
  callbackStatus?: 'all' | SendMessageCallbackStatus | Array<SendMessageCallbackStatus>;
  callbackURL?: string;
}
