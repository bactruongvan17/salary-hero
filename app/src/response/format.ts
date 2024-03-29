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
  balance: number
  standardWorkingDays: number
  actualWorkingDays: number
}

export interface GetEmployeeWorkLogsFormat {
  balance: number
  standardWorkingDays: number
  actualWorkingDays: number
  workLogs: WorkLogFormat[]
  employee: EmployeeFormat
}
