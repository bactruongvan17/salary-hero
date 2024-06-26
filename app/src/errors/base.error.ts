export class BaseError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.message = message
  }
}
