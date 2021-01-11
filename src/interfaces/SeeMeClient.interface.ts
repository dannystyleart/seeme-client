export interface SeeMeClient {
  getBalance(): Promise<any>;
  setIP(ipAddress: string): Promise<any>;
  sendMessage(address: string, message: string): Promise<any>;
}
