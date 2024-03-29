import { Request, Response } from 'express'
import { EmployeeController } from '../controllers/employee.controller'
import { EmployeeService } from '../services/employee.service'
import { HTTP_NOT_FOUND } from '../constants/http-status'
import { Employee } from '../models/entity/Employee'
import { Currency, EmployeeType } from '../constants/enum'
import { NotFoundError } from '../errors/not-found.error'
import { transformEmployee } from '../response/transform'

/**
 * Testcases for EmployeeController
 */
describe('EmployeeController', () => {
  let employeeController: EmployeeController
  let mockService: jasmine.SpyObj<EmployeeService>
  let req: Partial<Request>
  let res: Partial<Response>
  let jsonSpy: jasmine.Spy

  /**
   * Action: EmployeeController -> getEmployees
   */
  describe('getEmployees', () => {
    beforeEach(() => {
      mockService = jasmine.createSpyObj<EmployeeService>(['getEmployees'])
      employeeController = new EmployeeController(mockService)
      req = {}
      res = {
        json: jasmine.createSpy('json')
      }
      jsonSpy = res.json as jasmine.Spy
    })

    it('should return default limit = 10 when limit is missing in request', async () => {
      req.query = { page: '1' }
      mockService.getEmployees.and.returnValue(Promise.resolve({ total: 10, data: [] }))

      await employeeController.getEmployees(req as Request, res as Response)

      expect(mockService.getEmployees).toHaveBeenCalledWith(10, Number(req.query.page))

      expect(jsonSpy).toHaveBeenCalled()

      const result = jsonSpy.calls.mostRecent().args[0]
      expect(result).toEqual(jasmine.objectContaining({ limit: 10 }))
    })

    it('should return default limit = 10 when limit less than 1', async () => {
      req.query = { page: '1', limit: '-2' }
      mockService.getEmployees.and.returnValue(Promise.resolve({ total: 10, data: [] }))

      await employeeController.getEmployees(req as Request, res as Response)

      expect(mockService.getEmployees).toHaveBeenCalledWith(10, Number(req.query.page))

      expect(jsonSpy).toHaveBeenCalled()

      const result = jsonSpy.calls.mostRecent().args[0]
      expect(result).toEqual(jasmine.objectContaining({ limit: 10 }))
    })

    it('should return default page = 1 when page is missing in request', async () => {
      req.query = { limit: '1' }
      mockService.getEmployees.and.returnValue(Promise.resolve({ total: 10, data: [] }))

      await employeeController.getEmployees(req as Request, res as Response)

      expect(mockService.getEmployees).toHaveBeenCalledWith(Number(req.query.limit), 1)

      expect(jsonSpy).toHaveBeenCalled()

      const result = jsonSpy.calls.mostRecent().args[0]
      expect(result).toEqual(jasmine.objectContaining({ page: 1 }))
    })

    it('should return default limit = 10 when page less than 1', async () => {
      req.query = { page: '-2', limit: '10' }
      mockService.getEmployees.and.returnValue(Promise.resolve({ total: 10, data: [] }))

      await employeeController.getEmployees(req as Request, res as Response)

      expect(mockService.getEmployees).toHaveBeenCalledWith(Number(req.query.limit), 1)

      expect(jsonSpy).toHaveBeenCalled()

      const result = jsonSpy.calls.mostRecent().args[0]
      expect(result).toEqual(jasmine.objectContaining({ page: 1 }))
    })

    it('should return data has all keys are defined', async () => {
      req.query = { page: '1', limit: '10' }
      mockService.getEmployees.and.returnValue(Promise.resolve({ total: 2, data: [] }))

      await employeeController.getEmployees(req as Request, res as Response)

      expect(mockService.getEmployees).toHaveBeenCalledWith(Number(req.query.limit), 1)

      expect(jsonSpy).toHaveBeenCalled()

      const result = jsonSpy.calls.mostRecent().args[0]
      expect(result).toEqual(
        jasmine.objectContaining({
          total: 2,
          limit: Number(req.query.limit),
          page: Number(req.query.page),
          total_page: 1,
          data: []
        })
      )
    })
  })

  /**
   * Action: EmployeeController -> getEmployeeDetail
   */
  describe('getEmployeeDetail', () => {
    beforeEach(() => {
      mockService = jasmine.createSpyObj<EmployeeService>(['getEmployeeDetail'])
      employeeController = new EmployeeController(mockService)
      req = {}
      res = {
        json: jasmine.createSpy('json'),
        status: jasmine.createSpy('status').and.callFake((status) => {
          return {
            json: jasmine.createSpy('json').and.callFake((data) => {
              return data
            })
          }
        })
      }
      jsonSpy = res.json as jasmine.Spy
    })

    it('should response 404 when employee not found', async () => {
      req.params = { id: '1' }
      mockService.getEmployeeDetail.and.throwError(new NotFoundError('Employee Not Found'))

      await employeeController.getEmployeeDetail(req as Request, res as Response)

      expect(mockService.getEmployeeDetail).toHaveBeenCalledWith(Number(req.params.id))

      expect(res.status).toHaveBeenCalledWith(HTTP_NOT_FOUND)
    })

    it('should return employee when found', async () => {
      req.params = { id: '1' }
      const mockEmployee = new Employee()
      mockEmployee.id = Number(req.params.id)
      mockEmployee.name = 'John Doe'
      mockEmployee.type = EmployeeType.DAILY
      mockEmployee.salary = 1000
      mockEmployee.currency = Currency.TBH
      mockEmployee.dateStartWork = new Date()

      mockService.getEmployeeDetail.and.returnValue(Promise.resolve(transformEmployee(mockEmployee)))

      await employeeController.getEmployeeDetail(req as Request, res as Response)

      expect(mockService.getEmployeeDetail).toHaveBeenCalledWith(Number(req.params.id))

      expect(jsonSpy).toHaveBeenCalled()

      const result = jsonSpy.calls.mostRecent().args[0]
      expect(result).toEqual(
        jasmine.objectContaining({
          id: mockEmployee.id,
          name: mockEmployee.name,
          type: mockEmployee.type,
          salary: mockEmployee.salary,
          currency: mockEmployee.currency,
          date_start_work: mockEmployee.dateStartWork
        })
      )
    })
  })
})
