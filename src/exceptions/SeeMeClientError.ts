export class SeeMeClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SeeMeClientError';
  }
}
