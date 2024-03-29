import { HTTP_NOT_FOUND } from '../constants/http-status'
import { BaseError } from './base.error'

export class NotFoundError extends BaseError {
  statusCode: number = HTTP_NOT_FOUND

  constructor(message: string) {
    super(message)
    this.message = message
  }
}
