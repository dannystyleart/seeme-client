export class SeeMeErrorResponse extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SeeMeErrorResponse';
  }
}
