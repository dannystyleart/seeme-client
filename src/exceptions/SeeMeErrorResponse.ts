export class SeeMeErrorResponse extends Error {
  constructor(message?: string) {
    super(`SeeMeErrorResponse: ${message}`);
  }
}
