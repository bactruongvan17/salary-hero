import { NotFoundError } from '../errors/not-found.error'
import { EmployeeRepository } from '../repositories/employee.repository'
import { EmployeeFormat } from '../response/format'
import { transformEmployee } from '../response/transform'

/**
 * EmployeeService to interact with database
 */
export class EmployeeService {
  /**
   * Repository used by service
   */
  private repository: EmployeeRepository

  /**
   * Constructor
   * @param repository EmployeeRepository
   */
  constructor(repository: EmployeeRepository) {
    this.repository = repository
  }

  /**
   * Get employess with pagination
   * @param limit number
   * @param page number
   * @returns Promise<{total: number; data: EmployeeFormat[]}>
   */
  async getEmployees(limit: number, page: number): Promise<{ total: number; data: EmployeeFormat[] }> {
    const data = await this.repository.find({
      take: limit,
      skip: limit * (page - 1)
    })

    const total = await this.repository.count()

    const dataFormat = data.map((emp) => transformEmployee(emp))

    return { total, data: dataFormat }
  }

  /**
   * Get employee detail
   * @param id number
   * @returns Promise<EmployeeFormat>
   */
  async getEmployeeDetail(id: number): Promise<EmployeeFormat> {
    const employee = await this.repository.findOne({
      where: {
        id: id
      }
    })

    if (!employee) {
      throw new NotFoundError('Employee Not Found')
    }

    return transformEmployee(employee)
  }
}
