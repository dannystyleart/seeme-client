export interface SeeMeClient {
  getBalance(): Promise<any>;
  sendMessage(address: string, message: string): Promise<any>;
}
