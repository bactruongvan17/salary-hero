import moment from 'moment'
import { Employee } from '../../models/entity/Employee'
import { WorkLog } from '../../models/entity/WorkLog'
import { EmployeeRepository } from '../../repositories/employee.repository'
import { WorkLogRepository } from '../../repositories/work-log.repository'
import { EmployeeBalanceService } from '../../services/employee-balance.service'
import { Between } from 'typeorm'
import { AppDataSource } from '../../models/data-source'

export class UpdateEmployeeBalance {
  private employeeRepository: EmployeeRepository
  private workLogRepository: WorkLogRepository
  private month: Date
  private startOfMonth: Date
  private endOfMonth: Date

  constructor() {
    // run in midnight -> sub 1 day
    this.month = moment().subtract(1, 'day').toDate()
    this.startOfMonth = moment(this.month).startOf('month').toDate()
    this.endOfMonth = moment(this.month).endOf('month').toDate()

    this.employeeRepository = AppDataSource.getRepository(Employee)
    this.workLogRepository = AppDataSource.getRepository(WorkLog)
  }

  /**
   * Process update employee balance
   */
  public async process() {
    console.log('Start of process...')
    try {
      const employees = await this.employeeRepository.find()
      for (const employee of employees) {
        const workLogs = await this.getWorkLogsByEmployeeInMonth(employee.id)
        await this.updateEmployeeBalance(employee, workLogs)
      }
      console.log('Done')
    } catch (e) {
      console.log('Error during update: ', e)
    }
  }

  /**
   * Get WorkLogs by employee in this month
   * @param employeeId number
   * @returns Promise<WorkLog[]>
   */
  private async getWorkLogsByEmployeeInMonth(employeeId: number): Promise<WorkLog[]> {
    return this.workLogRepository.find({
      where: {
        employeeId: employeeId,
        logTime: Between(this.startOfMonth, this.endOfMonth)
      }
    })
  }

  /**
   * Update employee balance
   * @param employee Employee
   * @param workLogs WorkLog[]
   */
  private async updateEmployeeBalance(employee: Employee, workLogs: WorkLog[]) {
    if (!workLogs.length) {
      employee.balance = 0
    } else {
      const res = new EmployeeBalanceService(employee, workLogs, this.month).calculateBalance()
      employee.balance = res.balance
    }

    await this.employeeRepository.save(employee)
  }
}
