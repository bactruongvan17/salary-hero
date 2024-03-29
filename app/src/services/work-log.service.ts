import moment from 'moment'
import { WorkLogRepository } from '../repositories/work-log.repository'
import { Between } from 'typeorm'
import { EmployeeBalanceService } from './employee-balance.service'
import { EmployeeRepository } from '../repositories/employee.repository'
import { GetEmployeeWorkLogsFormat } from '../response/format'
import { transformEmployee, transformWorkLog } from '../response/transform'
import { NotFoundError } from '../errors/not-found.error'

export class WorkLogService {
  private repository: WorkLogRepository
  private employeeRepository: EmployeeRepository

  constructor(repository: WorkLogRepository, employeeRepository: EmployeeRepository) {
    this.repository = repository
    this.employeeRepository = employeeRepository
  }

  /**
   * Calculate balance of employee in the month
   * @param empId number
   * @param monthInStr string
   * @returns Promise<GetEmployeeWorkLogformat>
   */
  async getByEmployee(empId: number, monthInStr: string): Promise<GetEmployeeWorkLogsFormat> {
    const employee = await this.employeeRepository.findOne({ where: { id: empId } })
    if (!employee) {
      throw new NotFoundError('Employee invalid')
    }
    const month = moment(monthInStr)

    const startOfMonth = month.startOf('month').toDate()
    const endOfMonth = month.endOf('month').toDate()

    const workLogs = await this.repository.find({
      where: {
        employeeId: empId,
        logTime: Between(startOfMonth, endOfMonth)
      }
    })

    const empBalanceService = new EmployeeBalanceService(employee, workLogs, startOfMonth)
    const data = empBalanceService.calculateBalance()

    return {
      balance: data.balance,
      actualWorkingDays: data.actualWorkingDays,
      standardWorkingDays: data.standardWorkingDays,
      employee: transformEmployee(employee),
      workLogs: workLogs.map((workLog) => transformWorkLog(workLog))
    }
  }
}
