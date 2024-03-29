import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Currency, EmployeeType } from '../../constants/enum'
import { WorkLog } from './WorkLog'

@Entity({
  name: 'employees'
})
export class Employee {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 255,
    nullable: false
  })
  name: string

  @Column({
    type: 'enum',
    enum: EmployeeType,
    default: EmployeeType.MONTHY
  })
  type: EmployeeType

  @Column({
    type: 'double',
    nullable: false,
    default: 0
  })
  salary: number

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
    nullable: false
  })
  currency: Currency

  @Column({
    type: 'double',
    nullable: true,
    default: 0
  })
  balance: number

  @Column({
    type: 'date',
    nullable: false,
    name: 'date_start_work'
  })
  dateStartWork: Date

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at'
  })
  createAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at'
  })
  updatedAt: Date

  @OneToMany(() => WorkLog, (workLog) => workLog.employee, {})
  workLogs: WorkLog[]

  isMonthlyEmployee(): boolean {
    return this.type === EmployeeType.MONTHY
  }

  isDailyEmployee(): boolean {
    return this.type === EmployeeType.DAILY
  }
}
