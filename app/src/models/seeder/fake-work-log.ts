import { WorkDuration } from '../../constants/enum'
import { randomElementInArray } from '../../utils/helpers'
import { AppDataSource } from '../data-source'
import { Employee } from '../entity/Employee'
import { WorkLog } from '../entity/WorkLog'
import moment from 'moment'

export const seedWorkLogs = async () => {
  const employeeRepository = AppDataSource.getRepository(Employee)
  const workLogRepository = AppDataSource.getRepository(WorkLog)

  workLogRepository.delete({})

  const employees = await employeeRepository.find()
  for (const employee of employees) {
    const empDateStartWork = moment(employee.dateStartWork)
    const numberMonthsWereFaked = randomElementInArray([2, 3, 4])
    let endDate = moment(empDateStartWork).add(numberMonthsWereFaked, 'months').endOf('month')
    if (endDate > moment()) {
      endDate = moment()
    }

    const dataInsert = []
    while (empDateStartWork.isSameOrBefore(endDate, 'day')) {
      const isDayOff = randomElementInArray([0, 1]) === 0
      if (isDayOff) {
        empDateStartWork.add(1, 'day')
        continue
      }
      const log = new WorkLog()
      log.employeeId = employee.id
      log.currEmployeeType = employee.type
      log.currSalary = employee.salary
      log.workDuration = randomElementInArray(Object.values(WorkDuration))
      log.logTime = empDateStartWork.toDate()

      dataInsert.push(log)

      empDateStartWork.add(1, 'day')
    }

    if (dataInsert.length) {
      await workLogRepository.insert(dataInsert)
      console.log(`Done employee ${employee.id}`)
    }
  }
}
