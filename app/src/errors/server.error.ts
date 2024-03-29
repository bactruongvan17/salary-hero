import { HTTP_SERVER_ERROR } from '../constants/http-status'
import { BaseError } from './base.error'

export class ServerError extends BaseError {
  statusCode: number = HTTP_SERVER_ERROR

  constructor(message: string) {
    super(message)
    this.message = message
  }
}
