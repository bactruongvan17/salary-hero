import { Request, Response } from 'express'
import { WorkLogController } from '../controllers/work-log.controller'
import { WorkLogService } from '../services/work-log.service'
import { HTTP_NOT_FOUND } from '../constants/http-status'
import moment from 'moment'
import { WorkLog } from '../models/entity/WorkLog'
import { Employee } from '../models/entity/Employee'
import { transformEmployee } from '../response/transform'
import { Currency, EmployeeType } from '../constants/enum'

describe('WorkLogController', () => {
  let controller: WorkLogController
  let mockService: jasmine.SpyObj<WorkLogService>
  let req: Partial<Request>
  let res: Partial<Response>
  let jsonSpy: jasmine.Spy

  describe('getEmployeeWorkLogs', () => {
    beforeEach(() => {
      mockService = jasmine.createSpyObj<WorkLogService>(['getByEmployee'])
      controller = new WorkLogController(mockService)
      req = {}
      res = {
        json: jasmine.createSpy('json'),
        status: jasmine.createSpy('status').and.callFake(() => {
          return {
            json: jasmine.createSpy('json').and.callFake((data) => {
              return data
            })
          }
        })
      }
      jsonSpy = res.json as jasmine.Spy
    })

    it('should return not found when pass a invalid employeeId', async () => {
      req.params = { emp_id: '-1' }
      await controller.getEmployeeWorkLogs(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(HTTP_NOT_FOUND)
    })

    it('should use current month when pass a invalid month', async () => {
      req.params = { emp_id: '1' }
      req.query = { month: '2024' }
      const mockEmployee = new Employee()
      mockEmployee.id = Number(req.params.emp_id)
      mockEmployee.name = 'John Doe'
      mockEmployee.type = EmployeeType.DAILY
      mockEmployee.salary = 1000
      mockEmployee.currency = Currency.TBH
      mockEmployee.dateStartWork = new Date()

      mockService.getByEmployee.and.returnValue(
        Promise.resolve({
          actualWorkingDays: 1000,
          balance: 1,
          employee: transformEmployee(mockEmployee),
          workLogs: [],
          standardWorkingDays: 30
        })
      )

      await controller.getEmployeeWorkLogs(req as Request, res as Response)

      expect(mockService.getByEmployee).toHaveBeenCalledWith(Number(req.params.emp_id), moment().format('YYYY-MM-DD'))
    })

    it('should return data when employee has worklogs', async () => {
      req.params = { emp_id: '1' }
      req.query = { month: '2024-01-01' }

      const mockEmployee = new Employee()
      mockEmployee.id = Number(req.params.emp_id)
      mockEmployee.name = 'John Doe'
      mockEmployee.type = EmployeeType.DAILY
      mockEmployee.salary = 1000
      mockEmployee.currency = Currency.TBH
      mockEmployee.dateStartWork = new Date()

      mockService.getByEmployee.and.returnValue(
        Promise.resolve({
          actualWorkingDays: 1,
          balance: 1000,
          employee: transformEmployee(mockEmployee),
          workLogs: [],
          standardWorkingDays: 30
        })
      )

      const workLogs = []

      const wl1 = new WorkLog()
      wl1.employeeId = Number(req.params.emp_id)

      const wl2 = new WorkLog()
      wl1.employeeId = Number(req.params.emp_id)

      workLogs.push(wl1, wl2)

      await controller.getEmployeeWorkLogs(req as Request, res as Response)

      expect(mockService.getByEmployee).toHaveBeenCalledWith(Number(req.params.emp_id), req.query.month)

      expect(jsonSpy).toHaveBeenCalled()

      const result = jsonSpy.calls.mostRecent().args[0]
      expect(result).toEqual(
        jasmine.objectContaining({
          balance: 1000
        })
      )
    })
  })
})
