import cron from 'node-cron'
import { UpdateEmployeeBalance } from './commands/update-emp-balance.command'
import moment from 'moment'

export class Scheduler {
  public static start() {
    console.log('Start schedular...: ', moment())
    // run at 1:00 a.m each day
    cron.schedule('0 1 * * *', () => new UpdateEmployeeBalance().process())
  }
}
