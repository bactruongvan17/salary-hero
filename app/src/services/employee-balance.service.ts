import moment from 'moment'
import { WorkLog } from '../models/entity/WorkLog'
import { EmployeeType, WorkDuration } from '../constants/enum'
import { Employee } from '../models/entity/Employee'
import { CalculateEmployeeBalanceFormat } from '../response/format'

export class EmployeeBalanceService {
  private employee: Employee

  private workLogs: WorkLog[]

  private month: Date

  constructor(employee: Employee, workLogs: WorkLog[], month: Date) {
    this.employee = employee
    this.workLogs = workLogs
    this.month = month
  }

  /**
   * Calculate employee's balance in month
   * @returns CalculateEmployeeBalanceFormat
   */
  calculateBalance(): CalculateEmployeeBalanceFormat {
    // workdays: number of working days paid
    const actualWorkingDays = this.countActualWorkingDaysInMonth()

    const standardWorkingDays = this.getStandardWorkingDays()

    const baseSalary = this.getBaseSalary()

    const employeeType = this.getEmployeeType()

    let balance = 0

    if (employeeType === EmployeeType.MONTHY) {
      const paidWorkingDays = actualWorkingDays + this.getPaidHolidays()
      balance = this.calculateBalanceOfMonthlyEmployee(paidWorkingDays, standardWorkingDays, baseSalary)
    } else if (employeeType === EmployeeType.DAILY) {
      balance = this.calculateBalanceOfDailyEmployee(actualWorkingDays, baseSalary)
    }

    return {
      baseSalary,
      balance,
      standardWorkingDays,
      actualWorkingDays,
      employeeType: employeeType
    }
  }

  /**
   * Get total days in this month
   * @returns number
   */
  private countDaysInMonth(): number {
    return moment(this.month).daysInMonth()
  }

  /**
   * Get standard working days: include weekend, exlude holiday
   * Hardcode = total days in month
   * @returns number
   */
  private getStandardWorkingDays(): number {
    return this.countDaysInMonth()
  }

  /**
   * Get paid holidays
   * Hardcoe = 0
   * @returns number
   */
  private getPaidHolidays(): number {
    return 0
  }

  /**
   * Get actual working days with timekeeping in month of employee
   * @returns number
   */
  private countActualWorkingDaysInMonth(): number {
    let totalWorkdays = 0
    for (const workLog of this.workLogs) {
      if (workLog.workDuration === WorkDuration.FULL_DAY) {
        totalWorkdays++
      } else if (workLog.workDuration === WorkDuration.HALF_DAY) {
        totalWorkdays += 0.5
      }
    }

    return totalWorkdays
  }

  /**
   * Get base salary / base rate in month
   * @returns number
   */
  private getBaseSalary(): number {
    return !this.workLogs.length ? this.employee.salary : this.workLogs[0].currSalary;
  }

  /**
   * Get employee type in month
   * @returns EmployeeType
   */
  private getEmployeeType(): EmployeeType {
    return !this.workLogs.length ? this.employee.type : this.workLogs[0].currEmployeeType
  }

  /**
   * Calculate balance of monthly employee
   * Formula: (base salary / standard working days) * paid working days
   * @param baseSalary number
   * @param paidWorkingDays number
   * @param standardWorkingDay number
   * @returns number
   */
  private calculateBalanceOfMonthlyEmployee(
    paidWorkingDays: number,
    standardWorkingDay: number,
    baseSalary: number
  ): number {
    if (paidWorkingDays === 0) {
      return 0
    }

    return Math.round((baseSalary / standardWorkingDay) * paidWorkingDays)
  }

  /**
   * Calculate balance of daily employee
   * Formula: base salary * paid working days
   * @param baseSalary number
   * @param paidWorkingDays number
   * @returns number
   */
  private calculateBalanceOfDailyEmployee(paidWorkingDays: number, baseSalary: number): number {
    return baseSalary * paidWorkingDays
  }
}
