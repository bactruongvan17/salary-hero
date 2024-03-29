import { Request, Response } from 'express'
import { EmployeeService } from '../services/employee.service'
import { HTTP_SERVER_ERROR } from '../constants/http-status'
import { camelToSnake } from '../utils/helpers'
import { BaseError } from '../errors/base.error'

/**
 * EmployeeController to get all employees, get employee detail
 */
export class EmployeeController {
  /**
   * Service used by employee controller
   */
  private service: EmployeeService

  /**
   * Constructor
   * @param service EmployeeService
   */
  constructor(service: EmployeeService) {
    this.service = service
  }

  /**
   * Get list employees with pagination
   * @param req Request
   * @param res Response
   * @returns json
   */
  async getEmployees(req: Request, res: Response): Promise<any> {
    let limit = Number(req.query.limit) || 10
    if (limit < 1) {
      limit = 10
    }

    let page = Number(req.query.page) || 1
    if (page < 1) {
      page = 1
    }

    const { total, data } = await this.service.getEmployees(limit, page)

    const totalPage = Math.ceil(total / limit)

    return res.json({
      data: data.map((item) => camelToSnake(item)),
      total,
      limit,
      page,
      total_page: totalPage
    })
  }

  /**
   * Get Employee detail
   * @param req Request
   * @param res Response
   * @returns json
   */
  async getEmployeeDetail(req: Request, res: Response): Promise<any> {
    const empId: number = Number(req.params.id)

    try {
      const employee = await this.service.getEmployeeDetail(empId)

      return res.json(camelToSnake(employee))
    } catch (e: any | BaseError) {
      return res.status(e.statusCode ?? HTTP_SERVER_ERROR).json({
        message: e.message
      })
    }
  }
}
