import { EmployeeType, WorkDuration } from '../constants/enum'

export interface WorkLogFormat {
  employeeId: number
  currEmployeeType: EmployeeType
  currBaseSalary: number
  logTime: Date
  workDuration: WorkDuration
}

export interface EmployeeFormat {
  id: number
  name: string
  type: string
  salary: number
  currency: string
  dateStartWork: Date
}

export interface CalculateEmployeeBalanceFormat {
  baseSalary: number
  balance: number
  standardWorkingDays: number
  actualWorkingDays: number
  employeeType: EmployeeType
}

export interface GetEmployeeWorkLogsFormat {
  baseSalary: number
  balance: number
  standardWorkingDays: number
  actualWorkingDays: number
  workLogs: WorkLogFormat[]
  employee: EmployeeFormat
  employeeType: EmployeeType
}
