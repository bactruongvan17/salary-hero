import { Currency, EmployeeType, WorkDuration } from '../constants/enum'
import { Employee } from '../models/entity/Employee'
import { WorkLog } from '../models/entity/WorkLog'
import { EmployeeBalanceService } from '../services/employee-balance.service'
import { randomElementInArray } from '../utils/helpers'

describe('EmployeeBalanceService->calculateBalance', () => {
  let service: EmployeeBalanceService

  it('should add workdaysPaid when employee has days of furlough', () => {
    const employee = new Employee()
    employee.id = 1
    employee.type = EmployeeType.MONTHY
    employee.salary = 1000
    employee.currency = Currency.TBH

    const workLogs = []
    for (let i = 0; i < 10; i++) {
      const wl = new WorkLog()
      wl.employeeId = employee.id
      wl.currSalary = employee.salary
      wl.currEmployeeType = employee.type
      wl.workDuration = WorkDuration.FULL_DAY

      workLogs.push(wl)
    }

    service = new EmployeeBalanceService(employee, workLogs, new Date())

    const fakeDaysInMonth = 30
    const fakePaidHolidays = 2

    const spyGetStandardWorkingDay = spyOn<any>(service, 'getStandardWorkingDays').and.returnValue(fakeDaysInMonth)
    const spyGetPaidHolidays = spyOn<any>(service, 'getPaidHolidays').and.returnValue(fakePaidHolidays)

    const actualWorkingDays = workLogs.reduce((total: number, item: WorkLog): number => {
      if (item.workDuration === WorkDuration.FULL_DAY) {
        return (total += 1)
      } else if (item.workDuration === WorkDuration.HALF_DAY) {
        return (total += 0.5)
      }
      return total
    }, 0)

    const result = service.calculateBalance()
    expect(spyGetStandardWorkingDay).toHaveBeenCalled()
    expect(spyGetPaidHolidays).toHaveBeenCalled()
    expect(result.balance).toBe(
      Math.round((employee.salary / spyGetStandardWorkingDay()) * (actualWorkingDays + spyGetPaidHolidays()))
    )
  })

  it('should return success when employee is daily worker', () => {
    const employee = new Employee()
    employee.id = 1
    employee.type = EmployeeType.DAILY
    employee.salary = 1000
    employee.currency = Currency.TBH

    const workLogs = []
    for (let i = 0; i < 10; i++) {
      const wl = new WorkLog()
      wl.employeeId = employee.id
      wl.currSalary = employee.salary
      wl.currEmployeeType = employee.type
      wl.workDuration = randomElementInArray([0, 1]) === 0 ? WorkDuration.HALF_DAY : WorkDuration.FULL_DAY

      workLogs.push(wl)
    }

    service = new EmployeeBalanceService(employee, workLogs, new Date())

    const actualWorkingDays = workLogs.reduce((total: number, item: WorkLog): number => {
      if (item.workDuration === WorkDuration.FULL_DAY) {
        return (total += 1)
      } else if (item.workDuration === WorkDuration.HALF_DAY) {
        return (total += 0.5)
      }
      return total
    }, 0)

    const result = service.calculateBalance()
    expect(result.balance).toBe(employee.salary * actualWorkingDays)
  })
})
