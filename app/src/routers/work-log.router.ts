import express from 'express'
import { EmployeeController } from '../controllers/employee.controller'
import { EmployeeService } from '../services/employee.service'
import { Employee } from '../models/entity/Employee'
import { DataSource } from 'typeorm'
import { WorkLog } from '../models/entity/WorkLog'
import { WorkLogService } from '../services/work-log.service'
import { WorkLogController } from '../controllers/work-log.controller'

/**
 * EmployeeRouter
 * @param dataSource DataSource
 * @returns
 */
export default function workLogRouter(dataSource: DataSource): express.Router {
  const router = express.Router()

  const employeeRepository = dataSource.getRepository(Employee)
  const workLogRepository = dataSource.getRepository(WorkLog)
  const workLogService = new WorkLogService(workLogRepository, employeeRepository)
  const workLogController = new WorkLogController(workLogService)

  router.get('/:emp_id', workLogController.getEmployeeWorkLogs.bind(workLogController))

  return router
}
