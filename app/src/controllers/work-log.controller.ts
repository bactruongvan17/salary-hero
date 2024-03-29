import { Request, Response } from 'express'
import { WorkLogService } from '../services/work-log.service'
import moment from 'moment'
import { camelToSnake, validateDateFormat } from '../utils/helpers'
import { HTTP_NOT_FOUND, HTTP_SERVER_ERROR } from '../constants/http-status'
import { BaseError } from '../errors/base.error'

/**
 * WorkLogController to get current balance and work logs detail
 */
export class WorkLogController {
  /**
   * Service used by employee controller
   */
  private service: WorkLogService

  /**
   * Constructor
   * @param service EmployeeService
   */
  constructor(service: WorkLogService) {
    this.service = service
  }

  /**
   * Get list employees with pagination
   * @param req Request
   * @param res Response
   * @returns json
   */
  async getEmployeeWorkLogs(req: Request, res: Response): Promise<any> {
    const empId = Number(req.params.emp_id)
    if (empId <= 0) {
      return res.status(HTTP_NOT_FOUND).json({
        message: 'Employee Not Valid'
      })
    }

    let month = moment()
    const monthQuery = req.query.month?.toString()
    if (monthQuery && validateDateFormat(monthQuery)) {
      month = moment(monthQuery)
    }

    try {
      const data = await this.service.getByEmployee(empId, month.format('YYYY-MM-DD'))

      return res.json({
        balance: data.balance,
        actual_working_days: data.actualWorkingDays,
        standard_working_days: data.standardWorkingDays,
        employee: camelToSnake(data.employee),
        work_logs: data.workLogs.map((item) => camelToSnake(item))
      })
    } catch (e: any | BaseError) {
      return res.status(e.statusCode ?? HTTP_SERVER_ERROR).json({
        message: e.message
      })
    }
  }
}
