import { Employee } from '../models/entity/Employee'
import { WorkLog } from '../models/entity/WorkLog'
import { EmployeeFormat, WorkLogFormat } from './format'

/**
 * Transform employee entity to response format
 * @param employee Employee
 * @returns EmployeeFormat
 */
export function transformEmployee(employee: Employee): EmployeeFormat {
  return {
    id: employee.id,
    name: employee.name,
    type: employee.type,
    salary: employee.salary,
    currency: employee.currency,
    dateStartWork: employee.dateStartWork
  }
}

/**
 * Transform worklogs entity to response format
 * @param workLog WorkLog
 * @returns WorkLogFormat
 */
export function transformWorkLog(workLog: WorkLog): WorkLogFormat {
  return {
    employeeId: workLog.employeeId,
    currEmployeeType: workLog.currEmployeeType,
    currBaseSalary: workLog.currSalary,
    logTime: workLog.logTime,
    workDuration: workLog.workDuration
  }
}
