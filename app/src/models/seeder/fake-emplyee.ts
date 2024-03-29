import { faker } from '@faker-js/faker'
import { Employee } from '../entity/Employee'
import { randomElementInArray, randomNumber } from '../../utils/helpers'
import { Currency, EmployeeType } from '../../constants/enum'
import { AppDataSource } from '../data-source'
import { WorkLog } from '../entity/WorkLog'
import moment from 'moment'

export const seedEmployees = async (count: number) => {
  const repository = AppDataSource.getRepository(Employee)
  const workLogRepository = AppDataSource.getRepository(WorkLog)

  workLogRepository.delete({})
  repository.delete({})

  for (let i = 0; i < count; i++) {
    const employee = new Employee()
    employee.name = faker.person.fullName()
    employee.type = randomElementInArray(Object.values(EmployeeType))
    employee.salary = randomNumber(1000, 6000)
    employee.currency = randomElementInArray(Object.values(Currency))
    employee.dateStartWork = faker.date.between({
      from: '2023-11-01',
      to: moment().format('YYYY-MM-DD')
    })

    await repository.save(employee)
    console.log(`Employee ${i + 1} seeded successfully`)
  }
}
