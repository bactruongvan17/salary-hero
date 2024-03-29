import { Repository } from 'typeorm'
import { Employee } from '../models/entity/Employee'

export class EmployeeRepository extends Repository<Employee> {}
