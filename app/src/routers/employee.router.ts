import express from 'express'
import { EmployeeController } from '../controllers/employee.controller'
import { EmployeeService } from '../services/employee.service'
import { Employee } from '../models/entity/Employee'
import { DataSource } from 'typeorm'

/**
 * EmployeeRouter
 * @param dataSource DataSource
 * @returns
 */
export default function employeeRouter(dataSource: DataSource): express.Router {
  const router = express.Router()

  const employeeRepository = dataSource.getRepository(Employee)
  const employeeService = new EmployeeService(employeeRepository)
  const employeeController = new EmployeeController(employeeService)

  router.get('/', employeeController.getEmployees.bind(employeeController))
  router.get('/:id', employeeController.getEmployeeDetail.bind(employeeController))

  return router
}
