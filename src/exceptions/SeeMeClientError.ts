export class SeeMeClientError extends Error {
  constructor(message?: string) {
    super(`SeeMeClientError: ${message}`);
  }
}
