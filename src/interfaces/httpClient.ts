export interface HttpClientRequest {
  (path: string, params?: any): Promise<any>;
}
