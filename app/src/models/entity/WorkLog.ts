import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { EmployeeType, WorkDuration } from '../../constants/enum'
import { Employee } from './Employee'

@Entity({
  name: 'work_logs'
})
export class WorkLog {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'employee_id',
    nullable: false
  })
  employeeId: number

  @Column({
    type: 'enum',
    enum: EmployeeType,
    nullable: false,
    name: 'curr_emp_type'
  })
  currEmployeeType: EmployeeType

  @Column({
    type: 'double',
    nullable: false,
    name: 'curr_salary',
    default: 0
  })
  currSalary: number

  @Column({
    type: 'enum',
    enum: WorkDuration,
    default: WorkDuration.FULL_DAY,
    name: 'work_duration'
  })
  workDuration: WorkDuration

  @Column({
    type: 'timestamp',
    name: 'log_time',
    default: null
  })
  logTime: Date

  @ManyToOne(() => Employee, (employee) => employee.workLogs)
  @JoinColumn({
    name: 'employee_id',
    referencedColumnName: 'id'
  })
  employee: Employee
}
